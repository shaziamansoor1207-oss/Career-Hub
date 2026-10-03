// SKILLS PAGE: shows, adds, edits and deletes skills. All saving goes through storage.js.
import { initStorage, getSkills, addSkill, updateSkill, deleteSkill, getReadinessInputs } from '../core/storage.js';
import { skillsScore, calculateReadiness, levelForProgress } from '../core/readiness.js';
import { applyTheme } from '../ui/theme.js';
import { renderShell } from '../ui/shell.js';
import { showToast } from '../ui/toast.js';
import { confirmModal, openFormModal } from '../ui/modal.js';

const CATEGORIES = ['Programming', 'Web Development', 'Database', 'Software Engineering', 'Tools', 'Soft Skills'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

initStorage();
applyTheme();
renderShell('skills');

const $ = (id) => document.getElementById(id);
const list = $('skills-list');

// Escape text before putting it into HTML, so a skill name can never inject code.
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Rendering ---------- */

function cardHtml(skill) {
  const done = skill.progress >= 100;
  return `
    <article class="card skill-card" data-id="${esc(skill.id)}">
      <div class="skill-head">
        <div>
          <h3>${esc(skill.name)}</h3>
          <div class="skill-meta">
            <span class="badge">${esc(skill.category)}</span>
            <span class="badge">${esc(skill.level)}</span>
            ${done ? '<span class="badge success">Completed</span>' : ''}
          </div>
        </div>
        <span class="skill-percent">${skill.progress}%</span>
      </div>
      <div class="progress" role="progressbar" aria-label="${esc(skill.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${skill.progress}"><span style="width:${skill.progress}%"></span></div>
      <label class="sr-only" for="range-${esc(skill.id)}">Update ${esc(skill.name)} progress</label>
      <input class="skill-range" id="range-${esc(skill.id)}" type="range" min="0" max="100" step="5" value="${skill.progress}" data-action="range">
      <div class="skill-actions">
        ${done ? '' : '<button class="btn btn-ghost btn-sm" data-action="complete">Mark complete</button>'}
        <button class="btn btn-ghost btn-sm" data-action="edit">Edit</button>
        <button class="btn btn-ghost btn-sm" data-action="delete">Delete</button>
      </div>
    </article>`;
}

const emptyHtml = `
  <div class="empty">
    <h3>No skills yet</h3>
    <p>Add your first skill to start tracking your progress.</p>
    <button class="btn btn-primary" data-action="add">Add your first skill</button>
  </div>`;

// Redraws the summary card and the list from the latest saved data.
function render() {
  const skills = getSkills();
  const score = skillsScore(skills);                              // pure scoring
  const { total } = calculateReadiness(getReadinessInputs());     // overall Career Readiness
  $('summary-value').textContent = score + '%';
  $('summary-bar').style.width = score + '%';
  $('stat-total').textContent = skills.length;
  $('stat-done').textContent = skills.filter((s) => s.progress >= 100).length;
  $('stat-readiness').textContent = total + '%';
  list.innerHTML = skills.length ? skills.map(cardHtml).join('') : emptyHtml;
}

/* ---------- Add / Edit form ---------- */

function formHtml(skill) {
  const options = (items, current) => items.map((o) => `<option${o === current ? ' selected' : ''}>${esc(o)}</option>`).join('');
  return `
    <div class="field">
      <label class="label" for="f-name">Skill name</label>
      <input class="input" id="f-name" name="name" maxlength="40" autocomplete="off" placeholder="e.g. React basics" value="${esc(skill.name || '')}">
      <span class="error-text" data-error-for="name"></span>
    </div>
    <div class="field">
      <label class="label" for="f-category">Category</label>
      <select class="input" id="f-category" name="category">${options(CATEGORIES, skill.category)}</select>
    </div>
    <div class="form-row">
      <div class="field">
        <label class="label" for="f-level">Level</label>
        <select class="input" id="f-level" name="level">${options(LEVELS, skill.level)}</select>
      </div>
      <div class="field">
        <label class="label" for="f-progress">Progress (%)</label>
        <input class="input" id="f-progress" name="progress" type="number" min="0" max="100" inputmode="numeric" value="${skill.progress ?? 0}">
        <span class="error-text" data-error-for="progress"></span>
      </div>
    </div>`;
}

// Returns an object of error messages, or null when everything is valid.
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter a skill name.';
  const progress = Number(values.progress);
  if (values.progress === '' || Number.isNaN(progress) || progress < 0 || progress > 100) {
    errors.progress = 'Progress must be between 0 and 100.';
  }
  return Object.keys(errors).length ? errors : null;
}

function openSkillForm(skill = null) {
  openFormModal({
    title: skill ? 'Edit skill' : 'Add skill',
    submitText: skill ? 'Save changes' : 'Add skill',
    bodyHtml: formHtml(skill || {}),
    onSubmit(values) {
      const errors = validate(values);
      if (errors) return errors;
      const data = { name: values.name.trim(), category: values.category, level: values.level, progress: Math.round(Number(values.progress)) };
      if (skill) { updateSkill(skill.id, data); showToast('Skill updated.', 'success'); }
      else { addSkill(data); showToast('Skill added successfully.', 'success'); }
      render();
      return null;
    }
  });
}

/* ---------- Events ---------- */

$('add-skill').addEventListener('click', () => openSkillForm());

list.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  if (button.dataset.action === 'add') return openSkillForm();

  const skill = getSkills().find((s) => s.id === button.closest('.skill-card').dataset.id);
  if (!skill) return;

  if (button.dataset.action === 'edit') openSkillForm(skill);
  if (button.dataset.action === 'complete') {
    updateSkill(skill.id, { progress: 100, level: 'Advanced' });
    showToast(`${skill.name} marked as complete.`, 'success');
    render();
  }
  if (button.dataset.action === 'delete') {
    const ok = await confirmModal({ title: `Delete "${skill.name}"?`, message: 'This cannot be undone.' });
    if (ok) { deleteSkill(skill.id); showToast('Skill deleted.', 'success'); render(); }
  }
});

// The quick slider on each card saves when you let go of it.
list.addEventListener('change', (event) => {
  if (event.target.dataset.action !== 'range') return;
  const progress = Number(event.target.value);
  updateSkill(event.target.closest('.skill-card').dataset.id, { progress, level: levelForProgress(progress) });
  showToast('Progress updated.', 'success');
  render();
});

render();