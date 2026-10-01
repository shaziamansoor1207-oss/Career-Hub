// LANDING PAGE script: theme, icons and the live readiness preview in the hero.
import { initStorage } from '../core/storage.js';
import { calculateReadiness } from '../core/readiness.js';
import { applyTheme, initThemeToggles } from '../ui/theme.js';
import { hydrateIcons } from '../ui/icons.js';

initStorage();
applyTheme();
hydrateIcons();
initThemeToggles();

// The preview card uses the same scoring code as the real dashboard.
const { total, parts, message } = calculateReadiness();
const ring = document.getElementById('preview-ring');
ring.style.setProperty('--p', total);
ring.dataset.label = total + '%';
document.getElementById('preview-msg').textContent = message;

const LABELS = { skills: 'Skills', resume: 'Resume', projects: 'Projects', interview: 'Interview', portfolio: 'Portfolio' };
document.getElementById('preview-rows').innerHTML = Object.entries(LABELS).map(([key, label]) => `
  <div class="preview-row"><div><span>${label}</span><span>${parts[key]}%</span></div>
  <div class="progress"><span style="width:${parts[key]}%"></span></div></div>`).join('');
