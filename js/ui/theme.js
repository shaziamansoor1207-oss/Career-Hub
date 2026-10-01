// THEME: light/dark mode. The choice is saved through storage.js.
import { storage } from '../core/storage.js';
import { icon } from './icons.js';

export function applyTheme() {
  document.documentElement.dataset.theme = storage.get('theme', 'light');
}
export function toggleTheme() {
  storage.set('theme', storage.get('theme', 'light') === 'dark' ? 'light' : 'dark');
  applyTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach(paintToggle);
}
// Wire up every button marked data-theme-toggle.
export function initThemeToggles() {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    paintToggle(btn);
    btn.addEventListener('click', toggleTheme);
  });
}
function paintToggle(btn) {
  const dark = document.documentElement.dataset.theme === 'dark';
  btn.innerHTML = icon(dark ? 'sun' : 'moon');
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
