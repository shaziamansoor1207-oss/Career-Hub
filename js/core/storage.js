// STORAGE: the ONLY file that touches LocalStorage.
// Later, replace the inside of these functions with fetch() calls to a backend.
import { seedData } from './seed.js';
import { levelForProgress } from './readiness.js';

const PREFIX = 'careerhub:'; // keeps our keys separate from other sites/apps

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; } // broken JSON or blocked storage
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch (err) { console.error('Storage failed:', err); return false; }
  },
  remove(key) { localStorage.removeItem(PREFIX + key); }
};

// Fill storage with sample data the first time the app runs.
export function initStorage() {
  if (storage.get('seeded')) return;
  Object.entries(seedData).forEach(([key, value]) => storage.set(key, value));
  storage.set('seeded', true);
}

export function resetAllData() {
  Object.keys(seedData).concat('seeded').forEach((key) => storage.remove(key));
  initStorage();
}

// Helper for list data (projects, jobs). Used from Step 7 onward.
export function collection(name) {
  const read = () => storage.get(name, []);
  return {
    list: read,
    add(item) { const all = read(); const row = { ...item, id: 'id' + Date.now() }; all.push(row); storage.set(name, all); return row; },
    update(id, changes) { storage.set(name, read().map((x) => (x.id === id ? { ...x, ...changes } : x))); },
    remove(id) { storage.set(name, read().filter((x) => x.id !== id)); }
  };
}

/* ---------- SKILLS ---------- */

// Makes every skill have the same shape. Also upgrades older saved skills that used "percent".
function normalizeSkill(skill) {
  const progress = Number(skill.progress ?? skill.percent ?? 0);
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category || 'Tools',
    level: skill.level || levelForProgress(progress),
    progress
  };
}

export function getSkills() { return storage.get('skills', []).map(normalizeSkill); }
export function saveSkills(skills) { return storage.set('skills', skills); }

export function addSkill(skill) {
  const skills = getSkills();
  const row = { ...normalizeSkill(skill), id: 'sk' + Date.now() };
  skills.push(row);
  saveSkills(skills);
  return row;
}

export function updateSkill(id, updates) {
  saveSkills(getSkills().map((s) => (s.id === id ? normalizeSkill({ ...s, ...updates }) : s)));
}

export function deleteSkill(id) {
  saveSkills(getSkills().filter((s) => s.id !== id));
}

/* ---------- READINESS INPUTS ---------- */

// Gathers everything readiness.js needs, so pages can do: calculateReadiness(getReadinessInputs())
export function getReadinessInputs() {
  return {
    skills: getSkills(),
    resume: storage.get('resume', {}),
    projects: storage.get('projects', []),
    interview: storage.get('interview', { practiced: [] })
  };
}