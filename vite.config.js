import { defineConfig } from 'vite'

export default defineConfig({
  // Root directory (where index.html is located)
  root: '.',
  
  // Public directory for static assets
  publicDir: 'public',
  
  // Build configuration
  build: {
    outDir: 'dist',
    target: 'es2015', // Support for older browsers
    minify: 'terser',
    sourcemap: true
  },
  
  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@charset "UTF-8";`
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true, // Automatically open browser
    host: true  // Allow external connections
  }
})