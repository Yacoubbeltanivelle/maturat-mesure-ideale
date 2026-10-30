import { state, catalog } from './state.js';
import { parseRoute } from './lib/route.js';

export { ROUTES, isAdminPage, hashFor, hashForFamily, hashForProduct } from './lib/route.js';

/* Applique l'ancre courante à l'état. L'analyse elle-même vit dans lib/route.js. */
export function readRoute() {
  const route = parseRoute(location.hash, catalog);
  state.page = route.page;
  state.slug = route.slug;
}
