import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ENGINE_ROOT = '/home/kareltestspecial/0-IT/4-pj/x-v9/athena/factory';

/**
 * KDClaw Factory Service
 * Provides a bridge between the AI brain and the Athena CMS Factory muscles.
 */
export const runFactoryCommand = async (scriptPath, args = []) => {
  const fullPath = path.resolve(ENGINE_ROOT, scriptPath);
  const command = `node ${fullPath} ${args.join(' ')}`;

  console.log(`🏗️  KDClaw Factory: Executing [${command}]`);

  try {
    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=2048" }
    });

    if (stderr) console.warn(`⚠️ Factory Warning: ${stderr}`);
    
    // Check for "Error" or "Fout" (NL) in stdout since some scripts don't exit with code 1
    const lowerStdout = stdout.toLowerCase();
    if (lowerStdout.includes('error') || lowerStdout.includes('fout') || lowerStdout.includes('not found')) {
      return { success: false, error: stdout.trim() };
    }

    return { success: true, output: stdout };
  } catch (error) {
    console.error(`❌ Factory Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Common Factory Actions
 */
export const factory = {
  rebuildSite: (siteName) => runFactoryCommand('5-engine/rebuild-site.js', [siteName]),
  syncSheet: (siteName) => runFactoryCommand('5-engine/sync-sheet-to-json.js', [siteName]),
  provisionSheet: (siteName, email) => runFactoryCommand('5-engine/auto-sheet-provisioner.js', [siteName, email]),
  generateOverview: () => runFactoryCommand('5-engine/generate-sites-overview.js')
};
