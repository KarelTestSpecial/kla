/**
 * KDClaw Tool Dispatcher
 * Allows the AI Brain to execute registered tools on the host system.
 */

const registry = new Map();

/**
 * Registers a tool function for execution.
 * @param {string} name - Unique identifier for the tool.
 * @param {Function} fn - The function to execute.
 * @param {string} description - Description for the AI.
 */
export const registerTool = (name, fn, description) => {
  registry.set(name, { fn, description });
};

/**
 * Executes a registered tool with provided arguments.
 * @param {string} name - Name of the tool.
 * @param {Array} args - Arguments for the tool function.
 */
export const executeTool = async (name, args = []) => {
  if (!registry.has(name)) {
    throw new Error(`Tool [${name}] not found in registry.`);
  }

  const { fn } = registry.get(name);
  console.log(`🔌 DISPATCHER: Executing [${name}] with args:`, args);

  try {
    const result = await fn(...args);
    
    // If the tool function already returns a success/error object, pass it through
    if (result && typeof result === 'object' && 'success' in result) {
      return result;
    }
    
    return { success: true, result };
  } catch (error) {
    console.error(`🔌 DISPATCHER ERROR [${name}]:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Returns a list of all registered tools for AI prompting.
 */
export const getToolDefinitions = () => {
  const definitions = [];
  registry.forEach((value, key) => {
    definitions.push({
      name: key,
      description: value.description
    });
  });
  return definitions;
};
