export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const escapeHTML = (value) =>
  String(value).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Chemin d'une ressource de public/, prefixe par la base du site. */
export const asset = (path) => `${import.meta.env?.BASE_URL ?? '/'}${path}`;
