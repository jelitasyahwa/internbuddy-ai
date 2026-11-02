/**
 * InternBuddy AI — Shared Navigation Logic
 *
 * Handles:
 *   1. Mobile top-nav hamburger toggle (Beranda page)
 *   2. Mobile sidebar toggle (Chat & Panduan pages)
 */

(function () {
  'use strict';

  /* ============================================================
     1. TOP NAV — Mobile hamburger (index.html)
     ============================================================ */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileNav.style.display === 'flex';
      mobileNav.style.display = isOpen ? 'none' : 'flex';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     2. SIDEBAR — Mobile toggle (chat.html & panduan.html)
     ============================================================ */
  const sidebarToggle  = document.getElementById('sidebarToggle');
  const sidebar        = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar && sidebarOverlay) {
    function openSidebar() {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('show');
      sidebarToggle.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
      sidebarToggle.setAttribute('aria-expanded', 'false');
    }

    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close sidebar when a nav link is clicked on mobile
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 900) closeSidebar();
      });
    });
  }

  /* ============================================================
     3. Auto-close mobile nav on window resize
     ============================================================ */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 600 && mobileNav) {
      mobileNav.style.display = 'none';
    }
    if (window.innerWidth > 900 && sidebar) {
      sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    }
  });

})();
