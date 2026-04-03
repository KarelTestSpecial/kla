import dotenv from 'dotenv';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { generateWithWaterfall } from './services/waterfall.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runAutonomousTurn() {
  console.log("💓 KDClaw Heartbeat: Thinking with Waterfall Resilience...");

  try {
    const soul = await readFile(path.join(__dirname, 'identity', 'SOUL.md'), 'utf-8');
    const heart = await readFile(path.join(__dirname, 'identity', 'HEART.md'), 'utf-8');
    const heartbeat = await readFile(path.join(__dirname, 'identity', 'HEARTBEAT.md'), 'utf-8');
    const memory = await readFile(path.join(__dirname, 'memory', 'MEMORY.md'), 'utf-8');

    const systemInstruction = `${soul}\n\n${heart}\n\nAUTONOMOUS MISSION:\n${heartbeat}\n\nCURRENT STATE:\n${memory}`;
    
    // Phase 3: Recursive Waterfall Failover for Heartbeat
    const result = await generateWithWaterfall(
      "Execute your heartbeat tasks. Update MEMORY.md with a summary of the most strategic action taken.", 
      systemInstruction
    );

    console.log(`✅ Heartbeat Task Completed [Model: ${result.model}]:`, result.text);

    const updatedMemory = `${memory}\n\n- [Auto-Log ${new Date().toISOString()}] (${result.model}) ${result.text}`;
    await writeFile(path.join(__dirname, 'memory', 'MEMORY.md'), updatedMemory);

  } catch (err) {
    if (err.message.includes("EXHAUSTED")) {
      console.error("❌ Heartbeat ABORTED: All models exhausted. Check API keys.");
    } else {
      console.error("❌ Heartbeat Failure:", err.message);
    }
  }
}

// Initial run
runAutonomousTurn();
// Set interval (30 minutes)
setInterval(runAutonomousTurn, 30 * 60 * 1000);
