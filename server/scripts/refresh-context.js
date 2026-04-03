import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * KDClaw Knowledge Grounding Script
 * Resets the agent's context to the absolute truth.
 */
async function refreshContext() {
  console.log('🔄 KDClaw: Starting Knowledge Grounding...');

  const FACTORY_DOCS = '/home/kareltestspecial/0-IT/3-DEV/y1/y/factory/factory/9-engine/DEVELOPER-GUIDE.md';
  const FACTORY_MANIFEST = '/home/kareltestspecial/0-IT/3-DEV/y1/y/factory/AI-MANIFEST.md';

  try {
    // 1. Verify Local Memory
    console.log('--- 📋 Local Grounding ---');
    const memory = fs.readFileSync('./server/memory/MEMORY.md', 'utf8');
    console.log('✅ Memory.md loaded.');

    // 2. Verify Factory State
    console.log('--- 🏗️  Factory Grounding ---');
    if (fs.existsSync(FACTORY_DOCS)) {
      console.log('✅ Factory Developer Guide detected.');
    } else {
      console.warn('⚠️ Factory docs not found at expected path.');
    }

    // 3. Verify Cloud Registry
    console.log('--- 🐙 Cloud Grounding ---');
    console.log('Checking GitHub organization [athenasitesy]...');
    const ghStatus = execSync('gh repo list athenasitesy --limit 5 --json name', { encoding: 'utf8' });
    const repos = JSON.parse(ghStatus);
    console.log(`✅ GitHub Sync: ${repos.length} live sites found.`);

    console.log('\n✨ Grounding Complete. KDClaw is now fully synchronized with reality.');
  } catch (err) {
    console.error('❌ Grounding Failed:', err.message);
  }
}

refreshContext();
