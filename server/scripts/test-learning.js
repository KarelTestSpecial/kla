import { generateWithWaterfall } from '../services/waterfall.js';
import { registerSkill, getAllSkills } from '../skills/index.js';

async function testLearning() {
  console.log('🚀 KDClaw Learning Test Starting...');

  const prompt = `
    Bedenk een slimme 'Zero-Budget Outreach' strategie voor een freelance Node.js developer.
    Focus op hoe je klanten benadert zonder advertentiekosten, gebruikmakend van gratis AI tools.
    Geef je antwoord in JSON formaat met de volgende velden:
    {
      "skill_id": "zero_budget_outreach",
      "name": "Zero-Budget Outreach Strategy",
      "description": "Een korte beschrijving van de strategie",
      "steps": ["stap 1", "stap 2", "..."],
      "tools": ["tool 1", "tool 2"]
    }
  `;

  const systemInstruction = "Je bent KDClaw, een strategische partner voor professionele groei. Je antwoordt ALTIJD in valide JSON.";

  try {
    console.log('🧠 KDClaw is aan het nadenken over een nieuwe strategie...');
    
    // We roepen de waterfall aan
    const result = await generateWithWaterfall(prompt, systemInstruction, { 
      isJson: true, 
      caller: 'learning-test',
      skillId: 'new_strategy_discovery' 
    });

    if (result && result.text) {
      console.log('✅ Strategie gegenereerd door:', result.model);
      
      // Nu 'leert' KDClaw: we registreren de uitkomst als een nieuwe skill
      const learnedSkill = registerSkill({
        id: result.text.skill_id,
        name: result.text.name,
        description: result.text.description,
        tools: result.text.tools,
        metadata: {
            steps: result.text.steps,
            discovered_by: result.model,
            discovered_at: new Date().toISOString()
        }
      });

      console.log('\n--- 📚 NIEUWE VAARDIGHEID GELEERD ---');
      console.log('ID:', learnedSkill.id);
      console.log('Naam:', learnedSkill.name);
      console.log('Omschrijving:', learnedSkill.description);
      console.log('------------------------------------\n');

      // Controleer alle skills
      const allSkills = getAllSkills();
      console.log(`Totaal aantal skills in registry: ${allSkills.length}`);
      
    }
  } catch (err) {
    console.error('❌ Fout tijdens de leertest:', err.message);
  }
}

testLearning();
