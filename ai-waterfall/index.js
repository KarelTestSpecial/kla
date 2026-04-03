import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

let config = {
    "settings": { "temperature": 0.7, "timeout_ms": 30000 }
};

const USAGE_LOG_PATH = path.resolve(__dirname, 'usage.log');
let cachedFreeModels = [];
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000;

try {
    const configPath = path.resolve(__dirname, 'ai-models.json');
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
} catch (e) {}

async function fetchFreeModels() {
    const now = Date.now();
    if (cachedFreeModels.length > 0 && (now - lastFetchTime < CACHE_DURATION_MS)) {
        return cachedFreeModels;
    }
    try {
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const json = await response.json();
        const models = json.data
            .filter(m => m.id.endsWith(':free'))
            .sort((a, b) => (a.id.includes('llama-3.3-70b') ? -1 : b.id.includes('llama-3.3-70b') ? 1 : 0))
            .map(m => m.id);
        cachedFreeModels = models;
        lastFetchTime = now;
        return models;
    } catch (err) {
        return cachedFreeModels;
    }
}

function logUsage(caller, model, inputType, success = true) {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    const logEntry = `${timestamp} | [${status}] | Project: ${caller || 'unknown'} | Model: ${model} | Type: ${inputType}\n`;
    try { fs.appendFileSync(USAGE_LOG_PATH, logEntry); } catch (e) {}
}

async function withTimeout(promise, ms) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });
    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId);
        return result;
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

export async function generateWithAI(input, { isJson = true, temp = 0.7, caller = 'anonymous', systemInstruction = '', skillId = null } = {}) {
    const logPrefix = `[AI-WATERFALL]`;
    const timeout = 45000;
    const freeModels = await fetchFreeModels();

    let prompt = Array.isArray(input) ? input.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n") : input;
    if (systemInstruction) prompt = `SYSTEM: ${systemInstruction}\n\n${prompt}`;

    const sequence = [
        ...freeModels.map(id => ({ provider: 'openrouter', model: id })),
        { provider: 'google', model: 'gemini-2.0-flash' },
        { provider: 'google', model: 'gemini-flash-latest' },
        { provider: 'groq', model: 'llama-3.3-70b-versatile' },
        { provider: 'huggingface', model: process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2' }
    ];

    for (const entry of sequence) {
        try {
            console.log(`${logPrefix} Trying ${entry.provider}:${entry.model}...`);
            let result = null;
            if (entry.provider === 'google') result = await withTimeout(tryGoogle({ modelName: entry.model, prompt, isJson, temp }), timeout);
            else if (entry.provider === 'groq') result = await withTimeout(tryGroq({ modelName: entry.model, prompt, isJson, temp }), timeout);
            else if (entry.provider === 'openrouter') result = await withTimeout(tryOpenRouter({ modelName: entry.model, prompt, isJson, temp }), timeout);
            else if (entry.provider === 'huggingface') result = await withTimeout(tryHuggingFace({ modelName: entry.model, prompt, isJson, temp }), timeout);

            if (result) {
                logUsage(caller, entry.model, Array.isArray(input) ? "messages" : "prompt");
                
                // Learning Hook: If a skillId is provided, we could record this success
                if (skillId) {
                    console.log(`${logPrefix} 💡 Success for skill: ${skillId}. Learning potential recognized.`);
                }
                
                return { text: result, model: entry.model, provider: entry.provider };
            }
        } catch (e) {
            console.warn(`${logPrefix} ⚠️ ${entry.model} failed: ${e.message}`);
            logUsage(caller, entry.model, "prompt", false);
        }
    }
    throw new Error("EXHAUSTED: All AI models failed.");
}

async function tryGoogle({ modelName, prompt, isJson, temp }) {
    if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini key");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: isJson ? "application/json" : "text/plain", temperature: temp } });
    const result = await model.generateContent(prompt);
    const parts = result.response.candidates?.[0]?.content?.parts || [];
    const textPart = parts.find(p => p.text);
    return parseOutput(textPart ? textPart.text : (result.response.text ? result.response.text() : ""), isJson);
}

async function tryGroq({ modelName, prompt, isJson, temp }) {
    if (!process.env.GROQ_API_KEY) throw new Error("No Groq key");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName, messages: [{ role: "user", content: prompt }], temperature: temp })
    });
    if (!response.ok) throw new Error(`Groq ${response.status}`);
    const data = await response.json();
    return parseOutput(data.choices[0].message.content, isJson);
}

async function tryOpenRouter({ modelName, prompt, isJson, temp }) {
    if (!process.env.OPENROUTER_API_KEY) throw new Error("No OpenRouter key");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName, messages: [{ role: "user", content: prompt }], temperature: temp })
    });
    if (!response.ok) throw new Error(`OpenRouter ${response.status}`);
    const data = await response.json();
    return parseOutput(data.choices[0].message.content, isJson);
}

async function tryHuggingFace({ modelName, prompt, isJson, temp }) {
    if (!process.env.HF_TOKEN) throw new Error("No HF token");
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelName}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
    });
    if (!response.ok) throw new Error(`HF ${response.status}`);
    const data = await response.json();
    const text = Array.isArray(data) ? data[0].generated_text : data.generated_text;
    return parseOutput(text, isJson);
}

export function parseOutput(text, isJson) {
    if (!text) return null;
    let cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    if (!isJson) return cleanText;
    try {
        let clean = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = clean.indexOf('{') !== -1 ? clean.indexOf('{') : clean.indexOf('[');
        if (start !== -1) {
            const end = clean.lastIndexOf(clean[start] === '{' ? '}' : ']');
            if (end !== -1) return JSON.parse(clean.substring(start, end + 1));
        }
        return JSON.parse(clean);
    } catch (e) { return null; }
}
