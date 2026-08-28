/**
 * WefficientIT — JavaScript principal
 * Navigation · FAQ accordéon · Animations scroll · Formulaire contact
 * Vanilla JS, aucune dépendance externe
 */

'use strict';

/* --------------------------------------------------------------------------
   Navigation — effet scroll + menu mobile
   -------------------------------------------------------------------------- */
(function initNav() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (!nav) return;

  // Ajout de la classe scrolled pour l'ombre et la bordure
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermeture au clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Lien actif — comparaison du pathname
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (
      href === currentPath ||
      (href !== '/' && currentPath.startsWith(href))
    ) {
      link.classList.add('active');
    }
  });
})();

/* --------------------------------------------------------------------------
   FAQ — Accordéon accessible
   -------------------------------------------------------------------------- */
(function initFaq() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!btn || !answer) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Ferme tous les autres
      items.forEach(other => {
        if (other === item) return;
        const otherBtn = other.querySelector('.faq__question');
        const otherAns = other.querySelector('.faq__answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAns) otherAns.style.maxHeight = '0';
      });

      // Bascule l'item courant
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });
})();

/* --------------------------------------------------------------------------
   Animations — Révélation au scroll (IntersectionObserver)
   -------------------------------------------------------------------------- */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback : rend tout visible sans animation
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* --------------------------------------------------------------------------
   Formulaire de contact — validation et envoi
   -------------------------------------------------------------------------- */
(function initForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;

  const successMsg = form.querySelector('.form__feedback--success');
  const errorMsg = form.querySelector('.form__feedback--error');
  const submitBtn = form.querySelector('[type="submit"]');

  /**
   * Validation simple côté client
   * Retourne un tableau de messages d'erreur (vide si valide)
   */
  function validate(data) {
    const errors = [];
    if (!data.get('name')?.trim()) errors.push('Le nom est requis.');
    if (!data.get('company')?.trim()) errors.push('L\'entreprise est requise.');

    const email = data.get('email')?.trim();
    if (!email) {
      errors.push('L\'adresse email est requise.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('L\'adresse email semble incorrecte.');
    }

    if (!data.get('message')?.trim()) errors.push('La description du projet est requise.');
    return errors;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Masque les messages précédents
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg)   errorMsg.style.display = 'none';

    const data = new FormData(form);
    const errors = validate(data);

    if (errors.length) {
      if (errorMsg) {
        errorMsg.textContent = errors[0];
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    // État de chargement
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    /**
     * Envoi vers Formspree (ou endpoint personnalisé)
     * Remplacer l'action du formulaire dans le HTML par votre endpoint :
     *   <form action="https://formspree.io/f/YOUR_ID" ...>
     * Ou vers un script PHP maison.
     *
     * Pour l'instant : simulation d'envoi (à remplacer en production)
     */
    try {
      const action = form.getAttribute('action');

      if (action && action !== '#') {
        const res = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });

        if (!res.ok) throw new Error('Erreur serveur');
      } else {
        // Mode démo — simule un délai réseau
        await new Promise(r => setTimeout(r, 800));
      }

      // Succès
      form.reset();
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch {
      if (errorMsg) {
        errorMsg.textContent = 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.';
        errorMsg.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer ma demande';
      }
    }
  });
})();

/* --------------------------------------------------------------------------
   Smooth scroll sur les ancres internes
   -------------------------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // Hauteur nav
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();