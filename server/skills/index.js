import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DYNAMIC_SKILLS_PATH = path.resolve(__dirname, 'dynamic-skills.json');

/**
 * KDClaw Skill Registry
 * Defines the core capabilities of the autonomous agent.
 */

const staticSkills = {
  outreach: {
    name: 'Outreach',
    description: 'Automated communication for link-building and client acquisition.',
    tools: ['email_generator', 'contact_finder'],
    type: 'static'
  },
  job_search: {
    name: 'Job Search',
    description: 'Automated tracking and matching of work opportunities.',
    tools: ['job_scraper', 'cv_optimizer'],
    type: 'static'
  },
  webdesign: {
    name: 'Web Design',
    description: 'Creative direction and UI/UX planning for digital projects.',
    tools: ['color_palette_gen', 'layout_wireframer'],
    type: 'static'
  },
  webdevelopment: {
    name: 'Web Development',
    description: 'Core implementation and full-stack coding capabilities.',
    tools: ['code_refactorer', 'deployment_manager'],
    type: 'static'
  }
};

function loadDynamicSkills() {
  try {
    if (fs.existsSync(DYNAMIC_SKILLS_PATH)) {
      const data = fs.readFileSync(DYNAMIC_SKILLS_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading dynamic skills:', e);
  }
  return [];
}

export const getAllSkills = () => {
  const dynamic = loadDynamicSkills();
  const all = { ...staticSkills };
  dynamic.forEach(skill => {
    all[skill.id] = { ...skill, type: 'dynamic' };
  });
  return Object.values(all);
};

export const getSkill = (id) => {
  const all = getAllSkills();
  return all.find(s => s.id === id) || staticSkills[id] || null;
};

export const registerSkill = (skillData) => {
  const dynamic = loadDynamicSkills();
  const timestamp = new Date().toISOString();
  
  const newSkill = {
    ...skillData,
    id: skillData.id || `skill_${Date.now()}`,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const existingIndex = dynamic.findIndex(s => s.id === newSkill.id);
  if (existingIndex !== -1) {
    dynamic[existingIndex] = { ...dynamic[existingIndex], ...newSkill, updatedAt: timestamp };
  } else {
    dynamic.push(newSkill);
  }

  fs.writeFileSync(DYNAMIC_SKILLS_PATH, JSON.stringify(dynamic, null, 2));
  console.log(`[SKILL-ENGINE] Registered/Updated skill: ${newSkill.name}`);
  return newSkill;
};
