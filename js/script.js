// ============================================================
// Wait for the DOM to fully load before running any JS.
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. STICKY NAVBAR — Add shadow on scroll
  // ----------------------------------------------------------
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  // ----------------------------------------------------------
  // 2. MOBILE MENU TOGGLE
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
// 3. TYPING ANIMATION
// ----------------------------------------------------------
const typingPhrases = [
  'Learning by Building.',
  'Shipping Side Projects.',
  'Debugging Together.',
  'Growing Through Code.',
  'Turning Ideas into Reality.'
];

const typingTarget = document.getElementById('typing-text');

if (typingTarget) {
  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() {
    const current = typingPhrases[phraseIndex];

    if (isDeleting) {
      typingTarget.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      typingTarget.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;           // pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      delay = 400;            // pause before next word
    }

    setTimeout(type, delay);
  }

  type();
}

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

  // ----------------------------------------------------------
// 5. ACTIVE NAV LINK HIGHLIGHTING
// ----------------------------------------------------------
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links .nav-link');

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navItems.forEach(function (link) {
        link.classList.remove('active');
      });
      const activeLink = document.querySelector(
        '.nav-links a[href="#' + entry.target.id + '"]'
      );
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(function (section) {
  sectionObserver.observe(section);
});

}); // end DOMContentLoaded


// ----------------------------------------------------------
// 5. CONTACT FORM — Web3Forms submission with inline feedback
// ----------------------------------------------------------
(function () {
  const form      = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn   = document.getElementById('form-submit');
  const feedback    = document.getElementById('form-feedback');
  const nameInput   = document.getElementById('contact-name');
  const emailInput  = document.getElementById('contact-email');
  const phoneInput  = document.getElementById('contact-phone');
  const tierSelect  = document.getElementById('contact-tier');
  const nameError   = document.getElementById('name-error');
  const emailError  = document.getElementById('email-error');
  const phoneError  = document.getElementById('phone-error');
  const tierError   = document.getElementById('tier-error');

  // -- Inline validation helpers --
  function validateName() {
    if (!nameInput || !nameInput.value.trim()) {
      if (nameError) { nameError.textContent = 'Please enter your name.'; }
      if (nameInput) nameInput.classList.add('input-error');
      return false;
    }
    if (nameError) nameError.textContent = '';
    nameInput.classList.remove('input-error');
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    const ok  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!val) {
      if (emailError) emailError.textContent = 'Please enter your email address.';
      emailInput.classList.add('input-error');
      return false;
    }
    if (!ok) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('input-error');
      return false;
    }
    if (emailError) emailError.textContent = '';
    emailInput.classList.remove('input-error');
    return true;
  }

  function validatePhone() {
    if (!phoneInput) return true;
    if (!phoneInput.value.trim()) {
      if (phoneError) phoneError.textContent = 'Please enter your phone number.';
      phoneInput.classList.add('input-error');
      return false;
    }
    if (phoneError) phoneError.textContent = '';
    phoneInput.classList.remove('input-error');
    return true;
  }

  function validateTier() {
    if (!tierSelect) return true;
    if (!tierSelect.value) {
      if (tierError) tierError.textContent = 'Please select a service tier.';
      tierSelect.classList.add('input-error');
      return false;
    }
    if (tierError) tierError.textContent = '';
    tierSelect.classList.remove('input-error');
    return true;
  }

  if (nameInput)  nameInput.addEventListener('input',  validateName);
  if (emailInput) emailInput.addEventListener('input',  validateEmail);
  if (phoneInput) phoneInput.addEventListener('input',  validatePhone);
  if (tierSelect) tierSelect.addEventListener('change', validateTier);

  // -- Submission --
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameOk  = validateName();
    const emailOk = validateEmail();
    const phoneOk = validatePhone();
    const tierOk  = validateTier();
    if (!nameOk || !emailOk || !phoneOk || !tierOk) return;

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    submitBtn.disabled   = true;
    feedback.hidden      = true;
    feedback.className   = 'form-feedback';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   formData
      });
      const data = await response.json();

      if (response.ok) {
        feedback.textContent = '✓ Message sent! We\'ll get back to you soon.';
        feedback.classList.add('form-feedback--success');
        feedback.hidden = false;
        form.reset();
        if (nameError)  nameError.textContent  = '';
        if (emailError) emailError.textContent = '';
        if (phoneError) phoneError.textContent = '';
        if (tierError)  tierError.textContent  = '';
      } else {
        feedback.textContent = '✗ ' + (data.message || 'Something went wrong. Please try again.');
        feedback.classList.add('form-feedback--error');
        feedback.hidden = false;
      }
    } catch (err) {
      feedback.textContent = '✗ Network error. Please check your connection and try again.';
      feedback.classList.add('form-feedback--error');
      feedback.hidden = false;
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }
  });
})();
