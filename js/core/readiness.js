// READINESS: pure scoring logic. No localStorage, no DOM: data goes in, numbers come out.
export const WEIGHTS = { skills: 0.25, resume: 0.20, projects: 0.20, interview: 0.20, portfolio: 0.15 };
export const INTERVIEW_TOTAL = 25;   // updated automatically in Step 6 from the question list
const PROJECT_TARGET = 5;            // 5 projects = 100% for the Projects area
const RESUME_FIELDS = ['fullName', 'title', 'email', 'phone', 'location', 'summary', 'degree', 'university', 'linkedin', 'github'];

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

// Suggested level for a progress value (used when progress changes without an explicit level).
export function levelForProgress(progress) {
  if (progress >= 75) return 'Advanced';
  if (progress >= 40) return 'Intermediate';
  return 'Beginner';
}

// Skills score = average progress of all skills (0 if there are none).
export function skillsScore(skills = []) {
  if (!skills.length) return 0;
  return clamp(skills.reduce((sum, s) => sum + Number(s.progress || 0), 0) / skills.length);
}

// Pass in the data; get back the score. The caller (a page script) reads it from storage.js.
export function calculateReadiness({ skills = [], resume = {}, projects = [], interview = {} } = {}) {
  const practiced = (interview.practiced || []).length;

  const parts = {
    skills: skillsScore(skills),
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