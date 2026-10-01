// SHELL: builds the sidebar + top bar for every app page, so the HTML is not copied 8 times.
// To add a page later: add it to PAGES and set ready: true once the file exists.
import { icon } from './icons.js';
import { initThemeToggles } from './theme.js';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', href: 'dashboard.html', ready: true },
  { id: 'skills', label: 'Skills', icon: 'bars', href: 'skills.html', ready: false },
  { id: 'resume', label: 'Resume', icon: 'file', href: 'resume.html', ready: false },
  { id: 'interview', label: 'Interview', icon: 'chat', href: 'interview.html', ready: false },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase', href: 'jobs.html', ready: false },
  { id: 'projects', label: 'Projects', icon: 'folder', href: 'projects.html', ready: false },
  { id: 'profile', label: 'Profile', icon: 'user', href: 'profile.html', ready: false },
  { id: 'settings', label: 'Settings', icon: 'gear', href: 'settings.html', ready: false }
];

export function renderShell(activeId) {
  const links = PAGES.map((p) => p.ready
    ? `<a href="${p.href}" ${p.id === activeId ? 'aria-current="page"' : ''}>${icon(p.icon)}${p.label}</a>`
    : `<a aria-disabled="true" style="opacity:.45;cursor:default" title="Coming soon">${icon(p.icon)}${p.label}</a>`).join('');

  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <a class="brand" href="index.html"><span class="brand-mark">${icon('spark')}</span>CareerHub</a>
    <nav class="nav" aria-label="Main">${links}</nav>`;

  document.getElementById('topbar').innerHTML = `
    <button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu">${icon('menu')}</button>
    <strong>${PAGES.find((p) => p.id === activeId)?.label || ''}</strong>
    <div class="topbar-actions"><button class="icon-btn" data-theme-toggle></button></div>`;

  const toggleMenu = (open) => sidebar.classList.toggle('open', open);
  document.getElementById('menu-btn').addEventListener('click', () => toggleMenu(true));
  document.querySelector('.scrim').addEventListener('click', () => toggleMenu(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));
  initThemeToggles();
                                                    }
