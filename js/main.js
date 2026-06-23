
  (function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('.submit-btn');
    const submitDefaultHTML = submitBtn.innerHTML;

    function setStatus(message, type) {
      status.textContent = message;
      status.className = 'form-status ' + type;
    }

    function validateField(field) {
      const input = field.querySelector('input, textarea');
      const isValid = input.checkValidity();
      field.classList.toggle('invalid', !isValid);
      return isValid;
    }

    // validation live au fur et à mesure que l'utilisateur écrit
    form.querySelectorAll('.field').forEach((field) => {
      const input = field.querySelector('input, textarea');
      input.addEventListener('blur', () => validateField(field));
      input.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // valide tous les champs avant l'envoi
      let allValid = true;
      form.querySelectorAll('.field').forEach((field) => {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        setStatus('Merci de corriger les champs en rouge avant d\'envoyer.', 'error');
        return;
      }

      // bloque l'envoi si le placeholder Formspree n'a pas été remplacé
      if (form.action.includes('YOUR_FORM_ID')) {
        setStatus('⚠️ Configuration requise : remplace YOUR_FORM_ID par ton vrai ID Formspree dans le code.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Envoi en cours...';
      status.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          setStatus('✅ Message envoyé ! Je reviens vers toi très vite.', 'success');
          form.reset();
        } else {
          setStatus('Oups, une erreur est survenue. Réessaie ou écris-moi directement par email.', 'error');
        }
      } catch (err) {
        setStatus('Impossible d\'envoyer le message — vérifie ta connexion et réessaie.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitDefaultHTML;
      }
    });
  })();

  /* ---------- navbar fixe avec effet blur au scroll ---------- */
  (function () {
    const header = document.querySelector('header');
    if (!header) return;

    function updateHeader() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  })();

  /* ---------- menu hamburger / rideau ---------- */
  (function () {
    const hamburger = document.getElementById('hamburger-btn');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const curtain = document.getElementById('curtain');
    const closeBtn = document.getElementById('curtain-close');
    if (!hamburger || !curtain) return;

    function openMenu() {
      curtain.classList.add('is-open');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-xmark');
      }
    }
    function closeMenu() {
      curtain.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('fa-xmark');
        hamburgerIcon.classList.add('fa-bars');
      }
    }

    hamburger.addEventListener('click', () => {
      curtain.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    closeBtn.addEventListener('click', closeMenu);

    // ferme le rideau quand on clique un lien
    curtain.querySelectorAll('[data-curtain-link]').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // ferme avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && curtain.classList.contains('is-open')) closeMenu();
    });
  })();

  /* ---------- scrollspy : surligne le lien actif dans la navbar ---------- */
  (function () {
    const sections = document.querySelectorAll('section[id], div[id="competences"]');
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const curtainLinks = document.querySelectorAll('[data-curtain-link]');
    if (!sections.length || !navLinks.length) return;

    function setActive(id) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
      curtainLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }

    const spyObserver = new IntersectionObserver(
      (entries) => {
        // choisit la section la plus visible à l'écran
        let mostVisible = null;
        let maxRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
          }
        });
        if (mostVisible) setActive(mostVisible.id);
      },
      { threshold: [0.15, 0.3, 0.5, 0.7], rootMargin: '-90px 0px -40% 0px' }
    );

    sections.forEach((section) => spyObserver.observe(section));
  })();

  /* ---------- reveal au scroll ---------- */
  (function () {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealEls.length) return;

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  })();
