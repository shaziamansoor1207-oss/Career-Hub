// MODAL: confirm dialog + form dialog.
// confirmModal: if (await confirmModal({ title: 'Delete?' })) { ... }
// openFormModal: shows a form; onSubmit(values) returns {field: 'error'} to stay open, or null to close.
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

export function openFormModal({ title, bodyHtml, submitText = 'Save', onSubmit }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <form class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" novalidate>
      <h3 id="modal-title"></h3>
      <div>${bodyHtml}</div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" data-act="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary"></button>
      </div>
    </form>`;
  const form = backdrop.querySelector('form');
  backdrop.querySelector('h3').textContent = title;
  form.querySelector('[type="submit"]').textContent = submitText;

  const close = () => { document.removeEventListener('keydown', onKey); backdrop.remove(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.dataset.act === 'cancel') close();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = onSubmit(Object.fromEntries(new FormData(form)));
    // Show or clear the error message under each field
    form.querySelectorAll('[data-error-for]').forEach((node) => {
      node.textContent = (errors && errors[node.dataset.errorFor]) || '';
    });
    form.querySelectorAll('.input').forEach((input) => {
      input.classList.toggle('invalid', !!(errors && errors[input.name]));
    });
    if (!errors) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.append(backdrop);
  form.querySelector('input, select')?.focus();
}