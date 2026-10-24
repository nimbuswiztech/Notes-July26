/* ==========================================================================
   July 26 DevOps Notes — Interactive JavaScript Features
   ========================================================================== */

(function () {
  'use strict';

  // 1. Theme Toggle (Dark / Light) with LocalStorage
  const currentTheme = localStorage.getItem('notes-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  window.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      updateThemeButtonIcon(themeToggleBtn, currentTheme);
      themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('notes-theme', theme);
        updateThemeButtonIcon(themeToggleBtn, theme);
      });
    }

    // 2. Mobile Sidebar Drawer Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('aside.sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // 3. Live Sidebar Search Filter
    const searchInput = document.getElementById('sidebar-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const linkItems = document.querySelectorAll('.sidebar-links li');
        const categories = document.querySelectorAll('.sidebar-category-group');

        linkItems.forEach((li) => {
          const text = li.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            li.style.display = '';
          } else {
            li.style.display = 'none';
          }
        });

        // Hide empty category headers and expand if searching
        categories.forEach((cat) => {
          const visibleLinks = cat.querySelectorAll('.sidebar-links li:not([style*="display: none"])');
          cat.style.display = visibleLinks.length > 0 ? '' : 'none';
          
          if (query && visibleLinks.length > 0) {
            cat.classList.remove('collapsed');
          }
        });
      });
    }

    // 3.5 Sidebar Collapsible Categories
    const categoryGroups = document.querySelectorAll('.sidebar-category-group');
    let collapsedState = [];
    try {
      collapsedState = JSON.parse(sessionStorage.getItem('sidebar-collapsed-state')) || [];
    } catch (e) {}

    categoryGroups.forEach((group, index) => {
      // Restore collapsed state
      if (collapsedState.includes(index)) {
        group.classList.add('collapsed');
      }
      
      // Always keep the group containing the active link expanded
      if (group.querySelector('.sidebar-links a.active')) {
        group.classList.remove('collapsed');
      }

      const header = group.querySelector('.sidebar-category-header');
      if (header) {
        header.addEventListener('click', () => {
          group.classList.toggle('collapsed');
          
          // Save state
          const newState = [];
          categoryGroups.forEach((g, i) => {
            if (g.classList.contains('collapsed')) {
              newState.push(i);
            }
          });
          sessionStorage.setItem('sidebar-collapsed-state', JSON.stringify(newState));
        });
      }
    });

    // 4. Setup Tab Switching
    document.querySelectorAll('.tabs-container').forEach((tabContainer) => {
      const tabBtns = tabContainer.querySelectorAll('.tab-btn');
      const tabPanels = tabContainer.querySelectorAll('.tab-panel');

      tabBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          tabPanels.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          if (tabPanels[idx]) {
            tabPanels[idx].classList.add('active');
          }
        });
      });
    });

    // 5. Code Copy Button Event Delegation
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.code-card');
        const codeElement = card ? card.querySelector('pre code, pre') : null;
        if (codeElement) {
          const text = codeElement.innerText;
          navigator.clipboard.writeText(text).then(() => {
            const orig = btn.innerText;
            btn.innerText = '✓ Copied!';
            btn.style.background = 'var(--accent-emerald)';
            btn.style.color = '#ffffff';
            setTimeout(() => {
              btn.innerText = orig;
              btn.style.background = '';
              btn.style.color = '';
            }, 2000);
          });
        }
      });
    });
    // 6. Sidebar Scroll Position Persistence
    if (sidebar) {
      const savedScroll = sessionStorage.getItem('sidebar-scroll-pos');
      if (savedScroll) {
        sidebar.scrollTop = parseInt(savedScroll, 10);
      } else {
        const activeLink = sidebar.querySelector('.sidebar-links a.active');
        if (activeLink) {
          activeLink.scrollIntoView({ block: 'center' });
        }
      }

      sidebar.addEventListener('scroll', () => {
        sessionStorage.setItem('sidebar-scroll-pos', sidebar.scrollTop);
      }, { passive: true });
    }
  });

  function updateThemeButtonIcon(btn, theme) {
    if (theme === 'light') {
      btn.innerHTML = '🌙 Dark Mode';
      btn.title = 'Switch to Dark Mode';
    } else {
      btn.innerHTML = '☀️ Light Mode';
      btn.title = 'Switch to Light Mode';
    }
  }
})();
