// DASHBOARD (placeholder for Step 1): proves the shell, theme, toast, modal and storage all work.
import { initStorage, resetAllData } from '../core/storage.js';
import { applyTheme } from '../ui/theme.js';
import { hydrateIcons } from '../ui/icons.js';
import { renderShell } from '../ui/shell.js';
import { showToast } from '../ui/toast.js';
import { confirmModal } from '../ui/modal.js';

initStorage();
applyTheme();
renderShell('dashboard');
hydrateIcons();

document.getElementById('test-toast').addEventListener('click', () => showToast('Foundation is working.', 'success'));
document.getElementById('reset-data').addEventListener('click', async () => {
  if (await confirmModal({ title: 'Reset sample data?', message: 'This restores the original sample data.', confirmText: 'Reset' })) {
    resetAllData();
    showToast('Sample data restored.', 'success');
  }
});
