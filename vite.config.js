const { defineConfig } = require('vite');
const reactPlugin = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  plugins: [reactPlugin()],
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
});
