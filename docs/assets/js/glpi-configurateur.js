/**
 * WefficientIT — Configurateur GLPI
 * Gestion de la sélection des modules, calcul dynamique du total,
 * mise à jour du récapitulatif sticky et accessibilité clavier.
 *
 * Aucune dépendance externe. Vanilla JS strict mode.
 * Chargé en defer — le DOM est prêt à l'exécution.
 */

'use strict';

(function initConfigurateurGlpi() {

  /* ------------------------------------------------------------------
     Données des modules
     Chaque entrée correspond à un data-id dans le HTML.
     group : sert à calculer les sous-totaux par groupe.
     name  : texte affiché dans le récapitulatif.
  ------------------------------------------------------------------ */
  const MODULE_META = {
    'base-serveur':    { group: 'base',         name: 'Déploiement serveur GLPI' },
    'inv-postes':      { group: 'inventaire',   name: 'Inventaire automatique des postes' },
    'inv-reseau':      { group: 'inventaire',   name: 'Inventaire réseau / équipements actifs' },
    'inv-atypique':    { group: 'inventaire',   name: 'Inventaire matériel atypique' },
    'inv-licences':    { group: 'inventaire',   name: 'Gestion des licences logicielles' },
    'ticketing':       { group: 'organisation', name: 'Ticketing structuré' },
    'ldap':            { group: 'organisation', name: 'Intégration annuaire LDAP / AD' },
    'formation':       { group: 'organisation', name: 'Formation équipe' },
    'ansible':         { group: 'avances',      name: 'Déploiement automatisé via Ansible' },
    'multi-entites':   { group: 'avances',      name: 'Architecture multi-entités' },
    'migration':       { group: 'avances',      name: 'Migration depuis l\'existant' },
  };

  /* Prix de base — toujours inclus */
  const BASE_PRICE = 700;

  /* ------------------------------------------------------------------
     Récupération des éléments DOM
  ------------------------------------------------------------------ */
  const allItems      = document.querySelectorAll('.cfg-item');
  const summaryList   = document.getElementById('cfg-summary-list');
  const totalEl       = document.getElementById('cfg-total');
  const countEl       = document.getElementById('cfg-count');
  const countPlural   = document.getElementById('cfg-count-plural');
  const countPlural2  = document.getElementById('cfg-count-plural2');

  const subtotalEls = {
    base:         document.getElementById('subtotal-base'),
    inventaire:   document.getElementById('subtotal-inventaire'),
    organisation: document.getElementById('subtotal-organisation'),
    avances:      document.getElementById('subtotal-avances'),
  };

  if (!allItems.length || !summaryList || !totalEl) return;

  /* ------------------------------------------------------------------
     État : quels modules sont sélectionnés ?
     La base est toujours sélectionnée (verrouillée).
  ------------------------------------------------------------------ */
  const selected = new Set(['base-serveur','inv-postes']);

  /* ------------------------------------------------------------------
     Lecture des données depuis le HTML
  ------------------------------------------------------------------ */
  function getItemData(el) {
    return {
      id:     el.dataset.id,
      price:  parseInt(el.dataset.price, 10) || 0,
      locked: el.classList.contains('cfg-item--locked'),
    };
  }

  /* ------------------------------------------------------------------
     Bascule de sélection d'un module
  ------------------------------------------------------------------ */
  function toggleItem(el) {
    const { id, locked } = getItemData(el);
    if (locked) return;

    if (selected.has(id)) {
      selected.delete(id);
      el.classList.remove('is-selected');
      el.setAttribute('aria-checked', 'false');
    } else {
      selected.add(id);
      el.classList.add('is-selected');
      el.setAttribute('aria-checked', 'true');
    }

    render();
  }

  /* ------------------------------------------------------------------
     Calcul des totaux
  ------------------------------------------------------------------ */
  function computeTotals() {
    const subtotals = { base: BASE_PRICE, inventaire: 0, organisation: 0, avances: 0 };
    let grand = BASE_PRICE;

    allItems.forEach(el => {
      const { id, price } = getItemData(el);
      if (id === 'base-serveur') return;  // Déjà dans subtotals.base
      if (!selected.has(id)) return;

      const group = MODULE_META[id]?.group;
      if (group && subtotals[group] !== undefined) {
        subtotals[group] += price;
      }
      grand += price;
    });

    return { subtotals, grand };
  }

  /* ------------------------------------------------------------------
     Formatage monétaire
  ------------------------------------------------------------------ */
  function formatPrice(amount) {
    return amount.toLocaleString('fr-FR') + '\u00a0€';  // espace insécable
  }

  /* ------------------------------------------------------------------
     Mise à jour du récapitulatif
  ------------------------------------------------------------------ */
  function updateSummary(subtotals, grand) {
    // --- Sous-totaux ---
    Object.entries(subtotals).forEach(([group, amount]) => {
      const el = subtotalEls[group];
      if (!el) return;
      el.textContent = formatPrice(amount);
      el.classList.toggle('has-value', amount > 0);
    });

    // --- Total principal avec animation pulse ---
    const newTotal = formatPrice(grand);
    if (totalEl.textContent !== newTotal) {
      totalEl.textContent = newTotal;
      totalEl.classList.remove('pulse');
      // Micro-délai pour forcer le reflow et déclencher la transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => totalEl.classList.add('pulse'));
      });
      setTimeout(() => totalEl.classList.remove('pulse'), 300);
    }

    // --- Liste des modules sélectionnés dans le récapitulatif ---
    // Conserver la ligne de base (toujours présente)
    const baseItem = summaryList.querySelector('.cfg-summary__item--base');
    summaryList.innerHTML = '';
    if (baseItem) summaryList.appendChild(baseItem);

    allItems.forEach(el => {
      const { id, price } = getItemData(el);
      if (id === 'base-serveur') return;
      if (!selected.has(id)) return;

      const li = document.createElement('li');
      li.className = 'cfg-summary__item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'cfg-summary__item-name';
      nameSpan.textContent = MODULE_META[id]?.name ?? id;

      const priceSpan = document.createElement('span');
      priceSpan.className = 'cfg-summary__item-price';
      priceSpan.textContent = formatPrice(price);

      li.appendChild(nameSpan);
      li.appendChild(priceSpan);
      summaryList.appendChild(li);
    });

    // --- Compteur ---
    const count = selected.size;
    if (countEl) countEl.textContent = count;
    if (countPlural) countPlural.textContent = count > 1 ? 's' : '';
    if (countPlural2) countPlural2.textContent = count > 1 ? 's' : '';
  }

  /* ------------------------------------------------------------------
     Mise à jour du lien CTA avec les modules sélectionnés en query string
     Permet de pré-remplir le formulaire côté contact si besoin
  ------------------------------------------------------------------ */
  function updateCta(grand) {
    const cta = document.getElementById('cfg-cta');
    if (!cta) return;

    const modules = [...selected].join(',');
    const base = cta.href.split('?')[0];
    cta.href = `${base}?solution=glpi&modules=${encodeURIComponent(modules)}`;
  }

  /* ------------------------------------------------------------------
     Rendu global — appelé à chaque changement
  ------------------------------------------------------------------ */
  function render() {
    const { subtotals, grand } = computeTotals();
    updateSummary(subtotals, grand);
    updateCta(grand);
  }

  /* ------------------------------------------------------------------
     Événements — clic et clavier (Espace / Entrée)
  ------------------------------------------------------------------ */
  allItems.forEach(el => {
    // Clic souris
    el.addEventListener('click', () => toggleItem(el));

    // Clavier : Espace et Entrée activent la sélection
    el.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleItem(el);
      }
    });
  });

  /* ------------------------------------------------------------------
     Initialisation — rendu de l'état de départ
  ------------------------------------------------------------------ */
  render();

})();
