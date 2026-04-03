import { generateWithAI } from '../../ai-waterfall/index.js';
import { registerSkill } from '../skills/index.js';

/**
 * Execute a completion with automatic failover using the central AI-Waterfall module.
 * Also includes the 'Learning Hook' to potentially register new skills.
 */
export async function generateWithWaterfall(prompt, systemInstruction, options = {}) {
  const { caller = 'server-waterfall', isJson = false, skillId = null } = options;

  try {
    const result = await generateWithAI(prompt, {
      systemInstruction,
      isJson,
      caller,
      skillId
    });

    // If the call was successful and had a skillId, we log it.
    // In a future phase, we can automate 'registerSkill' here if the AI's output
    // contains a specific 'new_skill' structure.
    if (skillId && result.text) {
      console.log(`💓 Waterfall: Successful execution for skill [${skillId}] using ${result.model}`);
    }

    return result;
  } catch (err) {
    console.error("❌ Waterfall: Error in centralized generation:", err.message);
    throw err;
  }
}
