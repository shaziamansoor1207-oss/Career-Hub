// MODAL: confirm dialog. Usage: if (await confirmModal({ title: 'Delete skill?' })) { ... }
export function confirmModal({ title, message = '', confirmText = 'Delete' }) {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title"></h3><p></p>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-act="cancel">Cancel</button>
          <button class="btn btn-danger" data-act="ok"></button>
        </div>
      </div>`;
    backdrop.querySelector('h3').textContent = title;
    backdrop.querySelector('p').textContent = message;
    backdrop.querySelector('[data-act="ok"]').textContent = confirmText;

    const close = (answer) => { document.removeEventListener('keydown', onKey); backdrop.remove(); resolve(answer); };
    const onKey = (e) => { if (e.key === 'Escape') close(false); };
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.dataset.act === 'cancel') close(false);
      if (e.target.dataset.act === 'ok') close(true);
    });
    document.addEventListener('keydown', onKey);
    document.body.append(backdrop);
    backdrop.querySelector('[data-act="cancel"]').focus();
  });
}
