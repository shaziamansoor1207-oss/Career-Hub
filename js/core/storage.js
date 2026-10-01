// STORAGE: the ONLY file that touches LocalStorage.
// Later, replace the inside of these functions with fetch() calls to a backend.
import { seedData } from './seed.js';

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

// Helper for list data (skills, projects, jobs). Used from Step 3 onward.
export function collection(name) {
  const read = () => storage.get(name, []);
  return {
    list: read,
    add(item) { const all = read(); const row = { ...item, id: 'id' + Date.now() }; all.push(row); storage.set(name, all); return row; },
    update(id, changes) { storage.set(name, read().map((x) => (x.id === id ? { ...x, ...changes } : x))); },
    remove(id) { storage.set(name, read().filter((x) => x.id !== id)); }
  };
}
