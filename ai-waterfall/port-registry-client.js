/**
 * Port Registry — Node.js client (Direct File Access via Python)
 * ============================================================
 * Deze client roept de python-client aan om consistentie te waarborgen.
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { homedir } from 'os';
import fs from 'fs';

const CLIENT_PY = join(homedir(), 'KDC/port-registry/client.py');
const REGISTRY_JSON = join(homedir(), 'KDC/port-registry/registry.json');

/**
 * Vraag een poort op voor een service.
 */
function getPort(service, opts = {}) {
  const { project = 'unknown', description = '', preferredPort, fallback } = opts;
  
  try {
    const args = [service, project, description];
    if (preferredPort) args.push(preferredPort);
    
    // Roep python client aan voor de zware logica en locking
    const cmd = `python3 "${CLIENT_PY}" "${args.join('" "')}"`;
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    
    const port = parseInt(output, 10);
    if (!isNaN(port)) {
      console.error(`[port-registry] ${service} → :${port}`);
      return port;
    }
  } catch (err) {
    if (fallback !== undefined) {
      console.error(`[port-registry] Register fout, fallback: :${fallback}`);
      return fallback;
    }
    
    // Laatste fallback: direct uit JSON lezen (read-only)
    try {
      if (fs.existsSync(REGISTRY_JSON)) {
        const data = JSON.parse(fs.readFileSync(REGISTRY_JSON, 'utf8'));
        if (data.services && data.services[service]) {
          const port = data.services[service].port;
          console.error(`[port-registry] (JSON) ${service} → :${port}`);
          return port;
        }
      }
    } catch (e) {}

    console.error(`[port-registry] FOUT: Kon geen poort toewijzen voor ${service}`);
    process.exit(1);
  }
}

/**
 * Geef een poort terug vrij (optioneel).
 * @param {string} service 
 */
function releasePort(service) {
    // Voorlopig niet geimplementeerd in JS client om het simpel te houden
    return true;
}

/**
 * Zoek de geregistreerde poort voor een service.
 */
function getRegisteredPort(service) {
    try {
        if (fs.existsSync(REGISTRY_JSON)) {
          const data = JSON.parse(fs.readFileSync(REGISTRY_JSON, 'utf8'));
          return data.services[service] ? data.services[service].port : null;
        }
    } catch (e) {}
    return null;
}

export { getPort, releasePort, getRegisteredPort };

// CommonJS fallback:
// Note: using default export or module.exports depending on environment
const exported = { getPort, releasePort, getRegisteredPort };
export default exported;
