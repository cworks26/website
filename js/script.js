document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 0. DARK MODE TOGGLE
  // ----------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('dark-mode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('dark-mode', 'false');
    }
  }

  const savedTheme = localStorage.getItem('dark-mode');
  if (savedTheme !== null) {
    setTheme(savedTheme === 'true');
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isCurrentlyDark = document.body.classList.contains('dark-mode');
      setTheme(!isCurrentlyDark);
    });
  }


  // ----------------------------------------------------------
  // 1. NAVBAR - Hide/Show on scroll
  // ----------------------------------------------------------
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });


  // ----------------------------------------------------------
  // 2. SCROLL REVEAL ANIMATIONS
  // ----------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && ('IntersectionObserver' in window)) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
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
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  // ----------------------------------------------------------
  // 3. ACTIVE NAV LINK HIGHLIGHTING
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-link');

  if (sections.length > 0 && navItems.length > 0 && ('IntersectionObserver' in window)) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navItems.forEach(function (link) {
            link.classList.remove('active');
          });
          const activeLink = document.querySelector(
            '.nav-links a[href="#' + entry.target.id + '"], .nav-links a[href$="#' + entry.target.id + '"]'
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
  }

}); // end DOMContentLoaded


// ----------------------------------------------------------
// 4. CONTACT FORM — Web3Forms submission
// ----------------------------------------------------------
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit');
  const feedback = document.getElementById('form-feedback');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');

  function validateName() {
    if (!nameInput || !nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Please enter your name.';
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
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
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

  if (nameInput) nameInput.addEventListener('input', validateName);
  if (emailInput) emailInput.addEventListener('input', validateEmail);
  if (phoneInput) phoneInput.addEventListener('input', validatePhone);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameOk = validateName();
    const emailOk = validateEmail();
    const phoneOk = validatePhone();
    if (!nameOk || !emailOk || !phoneOk) return;

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    submitBtn.disabled = true;
    feedback.hidden = true;
    feedback.className = 'form-feedback';

    try {
      const formData = new FormData(form);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        const name = nameInput ? nameInput.value.trim() : 'N/A';
        const email = emailInput ? emailInput.value.trim() : 'N/A';
        const phone = phoneInput ? phoneInput.value.trim() : 'N/A';
        const message = form.querySelector('textarea') ? form.querySelector('textarea').value.trim() : 'N/A';

        await fetch('https://discord.com/api/webhooks/1493186929200730232/FEOmFACU4P64xHDYXEieG20kWcHU306K0qlwxspmWnumiJg9VmjxMMXC1oc7inaJst_7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Cworks Website',
            avatar_url: 'https://the-runner-team.github.io/website/logo-primary.svg',
            embeds: [{
              title: '📬 New Contact Form Submission',
              color: 0x0d1b2a,
              fields: [
                { name: '👤 Name', value: name, inline: true },
                { name: '📧 Email', value: email, inline: true },
                { name: '📞 Phone', value: phone, inline: true },
                { name: '💬 Message', value: message, inline: false }
              ],
              footer: { text: 'Sent from Cworks website' },
              timestamp: new Date().toISOString()
            }]
          })
        });

        feedback.textContent = '✓ Message sent! We\'ll get back to you soon.';
        feedback.classList.add('form-feedback--success');
        feedback.hidden = false;
        form.reset();
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (phoneError) phoneError.textContent = '';
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
      submitBtn.disabled = false;
    }
  });
})();
