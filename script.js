// ============================================================
// Wait for the DOM to fully load before running any JS.
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. THEME TOGGLE — Dark / Light Mode
  //
  // Stores the user's preference in localStorage so it
  // persists across page visits.
  // ----------------------------------------------------------
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  const savedTheme = localStorage.getItem('codehub-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('codehub-theme', next);
  });


  // ----------------------------------------------------------
  // 2. STICKY NAVBAR — Add shadow on scroll
  // ----------------------------------------------------------
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  // ----------------------------------------------------------
  // 3. MOBILE MENU TOGGLE
  // ----------------------------------------------------------
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  // ----------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATION
  //
  // Uses IntersectionObserver to detect when .reveal elements
  // enter the viewport and adds .visible to trigger the CSS
  // fade-in + slide-up transition.
  // ----------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(function (el) {
    observer.observe(el);
  });

  // Fallback for older browsers
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

}); // end DOMContentLoaded


// ----------------------------------------------------------
// 5. CONTACT FORM HANDLER
//
// Prevents default submit and simulates a send.
// Replace this with a real API call to make it functional
// (e.g., Formspree, EmailJS, or your own backend).
// ----------------------------------------------------------
function handleFormSubmit(event) {
  event.preventDefault();

  const btn          = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;

  setTimeout(function () {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message "Sent" (UI Demo)';
    btn.style.background = 'linear-gradient(135deg, #22d3ee, #34d399)';

    setTimeout(function () {
      btn.innerHTML        = originalText;
      btn.disabled         = false;
      btn.style.background = '';
      event.target.reset();
    }, 3000);
  }, 1200);
}
