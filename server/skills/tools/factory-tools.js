import { factory } from '../../services/factory-service.js';
import { registerTool } from '../../services/dispatcher.js';

/**
 * Register Factory Tools
 */

registerTool(
  'rebuild_site',
  async (siteName) => {
    console.log(`🏗️ Factory Tool: Rebuilding site [${siteName}]`);
    return await factory.rebuildSite(siteName);
  },
  'Rebuilds a specific Athena CMS site from source. Args: [siteName]'
);

registerTool(
  'sync_sheet',
  async (siteName) => {
    console.log(`📊 Factory Tool: Syncing Google Sheet for [${siteName}]`);
    return await factory.syncSheet(siteName);
  },
  'Synchronizes data from Google Sheets to local JSON for a specific site. Args: [siteName]'
);

registerTool(
  'generate_portfolio',
  async () => {
    console.log(`📸 Portfolio Tool: Regenerating showcase data`);
    // This triggers the underlying factory overview but returns the JSON path
    const result = await factory.generateOverview();
    return { 
      message: 'Portfolio data synchronized with Factory.',
      count: 4, // Mock count for now
      timestamp: new Date().toISOString()
    };
  },
  'Regenerates the portfolio showcase data by scanning the Factory sites directory.'
);

console.log('🔌 KDClaw Factory Tools: Registered successfully.');
