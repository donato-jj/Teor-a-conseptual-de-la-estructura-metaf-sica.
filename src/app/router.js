// File: src/app/router.js

/**
 * Tab routing: shows/hides sections based on selected tab.
 * Tabs: frif | lab | how | impl
 */
export function initRouter() {
  const tabs = document.querySelectorAll('.tab');
  const sections = {
    frif: document.getElementById('sectionFrif'),
    lab: document.getElementById('dashboard'),
    how: document.getElementById('sectionHow'),
    impl: document.getElementById('implementation'),
  };

  function activate(tab) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    for (const [key, el] of Object.entries(sections)) {
      if (el) el.style.display = key === tab ? '' : 'none';
    }
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => activate(t.dataset.tab));
  });

  // Default: show lab tab
  activate('lab');
}
