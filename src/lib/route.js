import { familyBySlug, productBySlug, productByIdOrSlug } from '../data/queries.js';

/* Analyse d'ancre, sans état ni DOM : testable tel quel.
 *
 * Adresses : #/home, #/dropout, #/quote, #/products,
 *            #/families/<slug>, #/products/<slug>,
 *            #/admin, #/admin/catalog, #/admin/catalog/<identifiant ou slug>.
 * Les anciennes adresses du laboratoire de design (#E/home et ses voisines A à D)
 * restent valides et pointent vers les mêmes pages. */

export const ROUTES = [
  'home', 'dropout', 'quote', 'products', 'about', 'faq', 'suppliers',
  'legal', 'news', 'careers',
];

/* L'administration a ses propres niveaux d'adresse : elle est analysée à part. */
export const ADMIN_PAGES = ['admin', 'admin-catalog', 'admin-product', 'admin-requests', 'admin-notfound'];
export const isAdminPage = (page) => ADMIN_PAGES.includes(page);

const decode = (value) => {
  try { return decodeURIComponent(value); } catch { return value; }
};

/* #/admin, #/admin/catalog, #/admin/catalog/<fiche>. Une section inconnue ou une
 * fiche introuvable reste dans l'administration : l'écran d'erreur garde sa coque. */
function adminRoute(rest, catalog) {
  const [section = '', key = ''] = rest;
  if (!section) return { page: 'admin', slug: '' };
  if (section === 'requests') return { page: 'admin-requests', slug: '' };
  if (section !== 'catalog') return { page: 'admin-notfound', slug: decode(rest.join('/')) };

  const target = decode(key);
  if (!target) return { page: 'admin-catalog', slug: '' };
  if (productByIdOrSlug(catalog, target)) return { page: 'admin-product', slug: target };
  return { page: 'admin-notfound', slug: target };
}

export function parseRoute(hash, catalog) {
  const raw = String(hash ?? '').replace(/^#/, '').replace(/^[A-E]\//i, '').replace(/^\//, '');
  const parts = raw.split('/');
  const [head = '', param = ''] = parts;
  const slug = decode(param);

  if (!head) return { page: 'home', slug: '' };

  if (head === 'admin') return adminRoute(parts.slice(1), catalog);

  if (head === 'families') {
    if (slug && familyBySlug(catalog, slug)) return { page: 'family', slug };
    return { page: 'notfound', slug };
  }

  if (head === 'products' && slug) {
    // Une fiche masquée depuis l'administration n'est plus publiée : son adresse
    // directe mène à l'état introuvable, qui annonce déjà ce cas. Elle reste
    // entièrement visible et modifiable dans l'administration.
    const product = productBySlug(catalog, slug);
    if (product && product.published !== false) return { page: 'product', slug };
    return { page: 'notfound', slug };
  }

  if (ROUTES.includes(head)) return { page: head, slug: '' };

  return { page: 'notfound', slug: decode(raw) };
}

export const hashFor = (page) => `#/${page}`;
export const hashForFamily = (slug) => `#/families/${encodeURIComponent(slug)}`;
export const hashForProduct = (slug) => `#/products/${encodeURIComponent(slug)}`;
export const hashForAdminProduct = (key) => `#/admin/catalog/${encodeURIComponent(key)}`;
