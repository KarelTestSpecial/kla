import { generateWithWaterfall } from './waterfall.js';
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * KDClaw Job & Outreach Service
 * Uses the AI Waterfall to find opportunities and write strength-based proposals.
 */

export const jobService = {
  /**
   * Finds potential freelance or job opportunities based on the user's stack (React/Node).
   */
  async findOpportunities(query = 'React Developer freelance Belgium') {
    const prompt = `
      Opdracht: Zoek actuele freelance- of job-opportuniteiten voor een Full-stack developer (React, Node.js, Vite).
      Regio: België/Nederland/Remote.
      Zoekopdracht: ${query}
      
      Retourneer een JSON-lijst met 3-5 objecten:
      [ { "title": "...", "company": "...", "description": "...", "link": "...", "source": "..." } ]
    `;

    try {
      const response = await generateWithWaterfall(prompt, "You are a professional Job Hunter AI expert.", { isJson: true });
      return { success: true, result: response.text };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Generates a strength-oriented proposal for a job.
   * Incorporates the user's unique path (re-integration, ASS, trauma-informed growth).
   */
  async generateProposal(jobDescription) {
    try {
      const soul = await readFile(path.resolve(__dirname, '../identity/SOUL.md'), 'utf-8');
      
      const prompt = `
        JOB BESCHRIJVING: ${jobDescription}
        
        GEBRUIKERSPROFIEL (Achtegrond):
        ${soul}
        
        OPDRACHT: Schrijf een overtuigende, professionele sollicitatiebrief of projectvoorstel. 
        Focus op:
        1. De technische skills (React, Node, Athena V9).
        2. De persoonlijke groei en 'Resilience' (wees open maar krachtig over het re-integratietraject).
        3. Waarom deze specifieke uitdaging past bij een autisme-gediagnosticeerde expert (focus op detail, loyaliteit, doorzettingsvermogen).
        
        Schrijf in het Nederlands, professionele toon, 'herstel'-georiënteerd.
      `;

      const response = await generateWithWaterfall(prompt, "You are a Senior Career Coach and Proposal Writer specializing in inclusive hiring.");
      return { success: true, result: response.text };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
