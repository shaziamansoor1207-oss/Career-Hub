// TOAST: small popup messages. Usage: showToast('Skill added successfully.', 'success')
export function showToast(message, type = 'info') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('role', 'status');
    document.body.append(wrap);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  wrap.append(toast);
  setTimeout(() => toast.remove(), 3500);
}
