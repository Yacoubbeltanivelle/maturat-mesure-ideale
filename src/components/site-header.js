import { asset } from '../lib/dom.js';
import { hashForFamily } from '../lib/route.js';

/* Determine the nav section key for the given page. */
function navKey(page) {
  if (page === 'products' || page === 'family' || page === 'product') return 'products';
  if (page === 'dropout' || page === 'suppliers' || page === 'about' ||
      page === 'faq' || page === 'quote' || page === 'home') return page;
  return null;
}

/* aria-current="page" only when a link exactly matches the current page.
 * The Produits disclosure uses sh-is-active for its section state because the
 * button opens a panel and is not itself a destination. */
function ariaC(itemKey, page) {
  const key = navKey(page);
  if (key !== itemKey) return 'false';
  if (itemKey === 'products' && page !== 'products') return 'false';
  return 'page';
}

export function siteHeader({ page, slug }, catalog) {
  const key = navKey(page);
  const prodActive = key === 'products';
  const families = catalog.families.filter(f => f.published !== false);

  const panelItems = [
    `<li><a class="sh-panel-catalog" href="#/products" aria-current="${page === 'products' ? 'page' : 'false'}">Tout le catalogue</a></li>`,
    ...families.map(f =>
      `<li><a class="sh-panel-family" href="${hashForFamily(f.slug)}" aria-current="${page === 'family' && slug === f.slug ? 'page' : 'false'}">${f.name}</a></li>`
    ),
  ].join('');

  const mobSubLinks = [
    `<a class="sh-mob-sub-link" href="#/products" aria-current="${page === 'products' ? 'page' : 'false'}">Tout le catalogue</a>`,
    ...families.map(f =>
      `<a class="sh-mob-sub-link" href="${hashForFamily(f.slug)}" aria-current="${page === 'family' && slug === f.slug ? 'page' : 'false'}">${f.name}</a>`
    ),
  ].join('');

  return `<a class="brand" href="#/home" aria-label="Maturat Mesure, accueil" aria-current="${page === 'home' ? 'page' : 'false'}"><img src="${asset('assets/maturat-logo.png')}" alt="Maturat Mesure"></a>
<nav class="sh-nav" aria-label="Navigation principale">
  <div class="sh-products-wrap">
    <button class="sh-products-btn${prodActive ? ' sh-is-active' : ''}" aria-expanded="false" aria-controls="sh-products-panel">Catalogue<span aria-hidden="true" class="sh-chevron"> ▾</span></button>
    <div id="sh-products-panel" class="sh-products-panel" hidden>
      <ul class="sh-panel-list">${panelItems}</ul>
    </div>
  </div>
  <a href="#/dropout" aria-current="${ariaC('dropout', page)}">Dropout</a>
  <a href="#/suppliers" aria-current="${ariaC('suppliers', page)}">Fournisseurs</a>
  <a href="#/about" aria-current="${ariaC('about', page)}">Maturat Mesure</a>
  <a href="#/faq" aria-current="${ariaC('faq', page)}">FAQ</a>
  <a href="#/quote" class="sh-cta nav-action" aria-current="${ariaC('quote', page)}">Décrire mon besoin</a>
</nav>
<div class="sh-compact">
  <button class="sh-menu-btn" aria-expanded="false" aria-controls="sh-mobile-dialog">Menu</button>
  <a href="#/quote" class="sh-cta-mini nav-action" aria-label="Décrire mon besoin" aria-current="${ariaC('quote', page)}">Mon besoin</a>
</div>
<dialog id="sh-mobile-dialog" class="sh-mobile-dialog" aria-label="Menu de navigation">
  <div class="sh-dialog-inner">
    <div class="sh-dialog-header">
      <span class="sh-dialog-label" aria-hidden="true">Navigation</span>
      <button class="sh-dialog-close" aria-label="Fermer le menu"><span aria-hidden="true" class="sh-close-icon">✕</span> Fermer</button>
    </div>
    <nav aria-label="Navigation mobile">
      <a class="sh-mob-link" href="#/home" aria-current="${page === 'home' ? 'page' : 'false'}">Accueil</a>
      <details class="sh-mob-products${prodActive ? ' sh-is-active' : ''}"${prodActive ? ' open' : ''}>
        <summary class="sh-mob-summary">Catalogue</summary>
        <div class="sh-mob-sub">${mobSubLinks}</div>
      </details>
      <a class="sh-mob-link" href="#/dropout" aria-current="${page === 'dropout' ? 'page' : 'false'}">Dropout</a>
      <a class="sh-mob-link" href="#/suppliers" aria-current="${page === 'suppliers' ? 'page' : 'false'}">Fournisseurs</a>
      <a class="sh-mob-link" href="#/about" aria-current="${page === 'about' ? 'page' : 'false'}">Maturat Mesure</a>
      <a class="sh-mob-link" href="#/faq" aria-current="${page === 'faq' ? 'page' : 'false'}">FAQ</a>
    </nav>
  </div>
</dialog>`;
}

/* Attach interactive behaviors to the rendered header. Returns cleanup.
 * All listeners share one AbortController so teardown is a single ctrl.abort(). */
export function mountHeader(headerEl) {
  const ctrl = new AbortController();
  const { signal } = ctrl;
  let pendingNavigation = false;

  const productsBtn = headerEl.querySelector('.sh-products-btn');
  const productsPanel = headerEl.querySelector('.sh-products-panel');
  const menuBtn = headerEl.querySelector('.sh-menu-btn');
  const dialog = headerEl.querySelector('.sh-mobile-dialog');
  const closeBtn = headerEl.querySelector('.sh-dialog-close');

  function openPanel() {
    if (!productsPanel || !productsPanel.hidden) return;
    productsPanel.hidden = false;
    productsBtn?.setAttribute('aria-expanded', 'true');
  }

  function closePanel(returnFocus = false) {
    if (!productsPanel || productsPanel.hidden) return;
    productsPanel.hidden = true;
    productsBtn?.setAttribute('aria-expanded', 'false');
    if (returnFocus) productsBtn?.focus();
  }

  function openDialog() {
    if (!dialog || dialog.open) return;
    dialog.showModal(); // browser handles top-layer focus trap natively
    menuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDialog() {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  // Products button: toggle panel
  productsBtn?.addEventListener('click', () => {
    productsPanel?.hidden ? openPanel() : closePanel(true);
  }, { signal });

  // Click outside products wrapper: close panel
  document.addEventListener('click', (e) => {
    if (!productsPanel || productsPanel.hidden) return;
    if (!headerEl.querySelector('.sh-products-wrap')?.contains(e.target)) closePanel(false);
  }, { signal });

  // Escape closes desktop panel; browser handles dialog Escape natively
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productsPanel && !productsPanel.hidden) {
      e.stopPropagation();
      closePanel(true);
    }
  }, { signal });

  // Link inside panel: close, let router manage focus after navigation
  productsPanel?.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      pendingNavigation = true;
      closePanel(false);
    }
  }, { signal });

  // Menu button opens dialog
  menuBtn?.addEventListener('click', openDialog, { signal });

  // Close button: 'close' event below handles focus return
  closeBtn?.addEventListener('click', closeDialog, { signal });

  // Link inside dialog: close, let router manage focus
  dialog?.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) {
      pendingNavigation = true;
      closeDialog();
    }
  }, { signal });

  // Dialog 'close' event: covers Escape, close button, and programmatic close
  dialog?.addEventListener('close', () => {
    menuBtn?.setAttribute('aria-expanded', 'false');
    // Return focus to trigger unless a navigation is responsible for the close
    if (!pendingNavigation) menuBtn?.focus();
    pendingNavigation = false;
  }, { signal });

  // Resize across breakpoint: close any open panel or dialog
  window.matchMedia('(min-width: 960px)').addEventListener('change', () => {
    closePanel(false);
    closeDialog();
  }, { signal });

  return () => {
    pendingNavigation = true; // suppress focus side-effect during teardown
    closePanel(false);
    closeDialog();
    ctrl.abort();
  };
}
