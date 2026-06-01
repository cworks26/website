(function () {

  var loader = document.getElementById('page-loader');
  var heroTitle = document.getElementById('hero-title');
  var heroSubtitle = document.getElementById('hero-subtitle');
  var loaderHidden = false;
  var heroRevealed = false;

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    if (loader) {
      loader.classList.add('page-loader--done');
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    }
  }

  function revealHero() {
    if (heroRevealed) return;
    if (!heroTitle || !heroSubtitle) return;
    heroRevealed = true;

    var titleText = heroTitle.textContent.trim();
    var titleChars = titleText.split('');

    heroTitle.textContent = '';
    titleChars.forEach(function (ch, i) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.animationDelay = (0.6 + i * 0.08) + 's';
      heroTitle.appendChild(span);
    });

    var subtitleText = heroSubtitle.textContent.trim();
    var words = subtitleText.split(' ');

    heroSubtitle.textContent = '';
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.animationDelay = (1.0 + i * 0.12) + 's';
      heroSubtitle.appendChild(span);
      if (i < words.length - 1) {
        heroSubtitle.appendChild(document.createTextNode(' '));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      revealHero();
      setTimeout(hideLoader, 1800);
    });
  } else {
    revealHero();
    setTimeout(hideLoader, 1800);
  }

  window.addEventListener('load', function () {
    hideLoader();
  });

  setTimeout(hideLoader, 3000);

})();


(function () {

  // ----------------------------------------------------------
  // 1. NAVBAR - Hide/Show on scroll
  // ----------------------------------------------------------
  var navbar = document.getElementById('navbar');
  var lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    var currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });


  // ----------------------------------------------------------
  // 2. SCROLL REVEAL ANIMATIONS (enhanced)
  // ----------------------------------------------------------
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');

  if (revealEls.length > 0 && ('IntersectionObserver' in window)) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  // ----------------------------------------------------------
  // 3. WORK VISUAL ROW — Staggered reveal on scroll
  // ----------------------------------------------------------
  var workRows = document.querySelectorAll('.work-visual-row[data-animate]');

  if (workRows.length > 0 && ('IntersectionObserver' in window)) {
    var workObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var row = entry.target;
          var els = row.querySelectorAll('.work-visual-number, .work-visual-title, .work-visual-desc, .work-visual-tags, .work-visual-link');
          els.forEach(function (el) {
            el.classList.add('visible');
          });
          workObserver.unobserve(row);
        }
      });
    }, {
      threshold: 0.25
    });

    workRows.forEach(function (row) {
      workObserver.observe(row);
    });
  }


  // ----------------------------------------------------------
  // 4. ACTIVE NAV LINK HIGHLIGHTING
  // ----------------------------------------------------------
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-links .nav-link');

  if (sections.length > 0 && navItems.length > 0 && ('IntersectionObserver' in window)) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navItems.forEach(function (link) {
            link.classList.remove('active');
          });
          var activeLink = document.querySelector(
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


  // ----------------------------------------------------------
  // 5. SMOOTH SCROLL
  // ----------------------------------------------------------
  document.documentElement.classList.add('smooth-scroll');

})();


// ----------------------------------------------------------
// 6. CONTACT FORM — Web3Forms submission
// ----------------------------------------------------------
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = document.getElementById('form-submit');
  var feedback = document.getElementById('form-feedback');
  var nameInput = document.getElementById('contact-name');
  var emailInput = document.getElementById('contact-email');
  var phoneInput = document.getElementById('contact-phone');
  var nameError = document.getElementById('name-error');
  var emailError = document.getElementById('email-error');
  var phoneError = document.getElementById('phone-error');

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
    var val = emailInput.value.trim();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameOk = validateName();
    var emailOk = validateEmail();
    var phoneOk = validatePhone();
    if (!nameOk || !emailOk || !phoneOk) return;

    var originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    submitBtn.disabled = true;
    feedback.hidden = true;
    feedback.className = 'form-feedback';

    var formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
    .then(function (result) {
      if (result.ok) {
        var name = nameInput ? nameInput.value.trim() : 'N/A';
        var email = emailInput ? emailInput.value.trim() : 'N/A';
        var phone = phoneInput ? phoneInput.value.trim() : 'N/A';
        var messageEl = form.querySelector('textarea');
        var message = messageEl ? messageEl.value.trim() : 'N/A';

        fetch('https://discord.com/api/webhooks/1493186929200730232/FEOmFACU4P64xHDYXEieG20kWcHU306K0qlwxspmWnumiJg9VmjxMMXC1oc7inaJst_7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Cworks Website',
            avatar_url: 'https://the-runner-team.github.io/website/logo-primary.svg',
            embeds: [{
              title: '\u{1F4EC} New Contact Form Submission',
              color: 0x0d1b2a,
              fields: [
                { name: '\u{1F464} Name', value: name, inline: true },
                { name: '\u{1F4E7} Email', value: email, inline: true },
                { name: '\u{1F4DE} Phone', value: phone, inline: true },
                { name: '\u{1F4AC} Message', value: message, inline: false }
              ],
              footer: { text: 'Sent from Cworks website' },
              timestamp: new Date().toISOString()
            }]
          })
        });

        feedback.textContent = '\u2713 Message sent! We\'ll get back to you soon.';
        feedback.classList.add('form-feedback--success');
        feedback.hidden = false;
        form.reset();
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (phoneError) phoneError.textContent = '';
      } else {
        feedback.textContent = '\u2717 ' + (result.data.message || 'Something went wrong. Please try again.');
        feedback.classList.add('form-feedback--error');
        feedback.hidden = false;
      }
    })
    .catch(function () {
      feedback.textContent = '\u2717 Network error. Please check your connection and try again.';
      feedback.classList.add('form-feedback--error');
      feedback.hidden = false;
    })
    .finally(function () {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    });
  });
})();
