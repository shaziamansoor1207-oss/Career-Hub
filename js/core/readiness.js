// READINESS: pure scoring logic. Takes data in, returns numbers out (no page code here).
import { storage } from './storage.js';

export const WEIGHTS = { skills: 0.25, resume: 0.20, projects: 0.20, interview: 0.20, portfolio: 0.15 };
export const INTERVIEW_TOTAL = 25;   // updated automatically in Step 6 from the question list
const PROJECT_TARGET = 5;            // 5 projects = 100% for the Projects area
const RESUME_FIELDS = ['fullName', 'title', 'email', 'phone', 'location', 'summary', 'degree', 'university', 'linkedin', 'github'];

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

export function calculateReadiness() {
  const skills = storage.get('skills', []);
  const resume = storage.get('resume', {});
  const projects = storage.get('projects', []);
  const practiced = storage.get('interview', { practiced: [] }).practiced.length;

  const parts = {
    skills: skills.length ? skills.reduce((sum, s) => sum + s.percent, 0) / skills.length : 0,
    resume: (RESUME_FIELDS.filter((f) => resume[f] && String(resume[f]).trim()).length / RESUME_FIELDS.length) * 100,
    projects: (projects.length / PROJECT_TARGET) * 100,
    interview: (practiced / INTERVIEW_TOTAL) * 100,
    // Portfolio: each project can earn 3 checks (GitHub link, live demo, image)
    portfolio: projects.length
      ? (projects.reduce((n, p) => n + !!p.github + !!p.demo + !!p.image, 0) / (projects.length * 3)) * 100 : 0
  };
  Object.keys(parts).forEach((k) => (parts[k] = clamp(parts[k])));

  const total = clamp(Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + parts[k] * w, 0));
  return { total, parts, message: scoreMessage(total) };
}

export function scoreMessage(score) {
  if (score < 40) return "Let's build your foundation.";
  if (score < 60) return "You're making progress.";
  if (score < 80) return "You're getting job ready.";
  return "You're highly prepared.";
}
