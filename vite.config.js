import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages sert le site sous /maturat-mesure/.
  base: '/maturat-mesure-ideale/',
  build: {
    outDir: 'dist',
    // Les ressources fournies vivent dans public/assets : on met les bundles ailleurs
    // pour qu'ils ne se melangent pas.
    assetsDir: 'build',
    emptyOutDir: true,
  },
});
