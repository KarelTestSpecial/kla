import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { getAllSkills } from './skills/index.js';
import { generateWithWaterfall } from './services/waterfall.js';
import './skills/tools/factory-tools.js'; // Register tools on startup
import { executeTool, getToolDefinitions } from './services/dispatcher.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fastify = Fastify({ logger: true });
fastify.register(cors);

let lastAction = null;

/**
 * Loads the core identity and values, including available tools.
 */
async function loadClawPersona() {
  try {
    const soul = await readFile(path.join(__dirname, 'identity', 'SOUL.md'), 'utf-8');
    const heart = await readFile(path.join(__dirname, 'identity', 'HEART.md'), 'utf-8');
    const memory = await readFile(path.join(__dirname, 'memory', 'MEMORY.md'), 'utf-8');
    
    const tools = getToolDefinitions();
    
    const toolInstruction = `
AVAILABLE ACTIONS:
You can execute tools by returning a JSON object. If you need to use a tool, return ONLY the JSON object and nothing else.
Tools:
${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

Format for tool use:
{ "tool": "tool_name", "args": ["arg1", "arg2"] }

If no tool is needed, respond with normal text.
`;

    return `${soul}\n\n${heart}\n\n${toolInstruction}\n\nCURRENT STATE:\n${memory}`;
  } catch (err) {
    return "You are KDClaw, a professional AI assistant.";
  }
}

fastify.post('/chat', async (request, reply) => {
  const { message } = request.body;
  const persona = await loadClawPersona();

  try {
    // Phase 3: Recursive Waterfall Failover
    let result = await generateWithWaterfall(message, persona, { isJson: true });
    
    // Check if the AI returned a tool call
    if (result.text && typeof result.text === 'object' && result.text.tool) {
      const toolCall = result.text;
      fastify.log.info(`🛠️ AI requesting tool: ${toolCall.tool}`);
      
      const toolResult = await executeTool(toolCall.tool, toolCall.args);
      
      lastAction = {
        name: toolCall.tool,
        status: toolResult.success ? 'success' : 'error',
        timestamp: new Date().toISOString()
      };

      // Feed the result back to the AI for a final natural language response
      const followUpPrompt = `Tool [${toolCall.tool}] result: ${JSON.stringify(toolResult.result || toolResult.error)}. 
Now provide a brief, professional confirmation to the user.`;
      
      const finalResponse = await generateWithWaterfall(followUpPrompt, persona);
      
      return {
        text: finalResponse.text,
        model: finalResponse.model,
        provider: finalResponse.provider,
        action: lastAction
      };
    }

    return { 
      text: typeof result.text === 'string' ? result.text : JSON.stringify(result.text), 
      model: result.model, 
      provider: result.provider 
    };
  } catch (error) {
    fastify.log.error(error);
    if (error.message.includes("EXHAUSTED")) {
      return reply.status(429).send({ error: "ALL_MODELS_EXHAUSTED", message: error.message });
    }
    return reply.status(500).send({ error: "KDClaw Brain Execution Error" });
  }
});

fastify.get('/skills', async (request, reply) => {
  return getAllSkills();
});

fastify.get('/identity', async (request, reply) => {
  try {
    const soul = await readFile(path.join(__dirname, 'identity', 'SOUL.md'), 'utf-8');
    const memoryPath = path.join(__dirname, 'memory', 'MEMORY.md');
    let memory = "";
    try {
      memory = await readFile(memoryPath, 'utf-8');
    } catch (e) {
      memory = "Initial search for memory failed.";
    }
    
    return { 
      soul, 
      memory,
      lastAction,
      lastUpdate: new Date().toISOString()
    };
  } catch (err) {
    return reply.status(500).send({ error: "Identity Load Error" });
  }
});

fastify.get('/portfolio', async (request, reply) => {
  const sitesDir = '/home/kareltestspecial/0-IT/4-pj/x-v9/athena/sites';
  try {
    const fs = await import('fs/promises');
    const files = await fs.readdir(sitesDir);
    const sites = [];

    for (const file of files) {
      if (file.startsWith('.') || file === 'node_modules') continue;
      
      try {
        const projectPath = path.join(sitesDir, file);
        // Using stat (follows links) directly to check if it's a valid directory
        const stats = await fs.stat(projectPath);
        
        if (stats.isDirectory()) {
          sites.push({
            id: file,
            name: file.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            description: `Een professionele website gebouwd voor ${file.replace(/-/g, ' ')} met de Athena v9 Engine.`,
            status: 'Published',
            url: `https://athenasitesy.github.io/${file}/`,
            lastBuild: stats.mtime.toISOString()
          });
        }
      } catch (err) {
        // Just skip if stat fails (broken symlink or permission)
        continue;
      }
    }
    return sites;
  } catch (err) {
    fastify.log.error(err);
    return [];
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
