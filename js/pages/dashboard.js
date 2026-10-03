// DASHBOARD: shows the live Career Readiness score. Stored data -> readiness.js -> UI.
import { initStorage, resetAllData, getReadinessInputs } from '../core/storage.js';
import { calculateReadiness, WEIGHTS } from '../core/readiness.js';
import { applyTheme } from '../ui/theme.js';
import { hydrateIcons } from '../ui/icons.js';
import { renderShell } from '../ui/shell.js';
import { showToast } from '../ui/toast.js';
import { confirmModal } from '../ui/modal.js';

initStorage();
applyTheme();
renderShell('dashboard');
hydrateIcons();

const LABELS = { skills: 'Skills', resume: 'Resume', projects: 'Projects', interview: 'Interview', portfolio: 'Portfolio' };

function renderReadiness() {
  const { total, parts, message } = calculateReadiness(getReadinessInputs());
  const ring = document.getElementById('ready-ring');
  ring.style.setProperty('--p', total);
  ring.dataset.label = total + '%';
  document.getElementById('ready-msg').textContent = message;
  document.getElementById('ready-rows').innerHTML = Object.entries(LABELS).map(([key, label]) => `
    <div class="preview-row">
      <div><span>${label} <small>· ${Math.round(WEIGHTS[key] * 100)}% of score</small></span><span>${parts[key]}%</span></div>
      <div class="progress"><span style="width:${parts[key]}%"></span></div>
    </div>`).join('');
}

renderReadiness();

document.getElementById('test-toast').addEventListener('click', () => showToast('Foundation is working.', 'success'));
document.getElementById('reset-data').addEventListener('click', async () => {
  if (await confirmModal({ title: 'Reset sample data?', message: 'This restores the original sample data.', confirmText: 'Reset' })) {
    resetAllData();
    renderReadiness();
    showToast('Sample data restored.', 'success');
  }
});