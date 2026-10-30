import { escapeHTML } from '../lib/dom.js';

const icons = {
  instrumentation: '<circle cx="12" cy="12" r="9"/><path d="m12 12 4-4M6 12h1m5-6v1m5 5h1M8 17h8"/>',
  product: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5.3l8 4.5"/>',
  sectors: '<path d="M3 21V10l6 3V8l6 3V3h5v18H3Z"/><path d="M7 17h1m4 0h1m4 0h1"/>',
  suppliers: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="12" cy="21" r="2"/><path d="m5.5 5.5 4.4 4.4m8.6-4.4-4.4 4.4M12 15v4"/>',
  method: '<path d="M7 3h10v18H7zM10 7h4m-4 5h4m-4 5h4M3 7h1m-1 5h1m-1 5h1"/>',
};
export const sectionLabel = (text, icon) => `<div class="section-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[icon] ?? icons.method}</svg><span>${escapeHTML(text)}</span></div>`;
