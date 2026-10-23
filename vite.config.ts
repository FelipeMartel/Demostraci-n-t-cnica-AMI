import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // rutas relativas: el build funciona en cualquier carpeta del servidor
  server: { host: false },
});
