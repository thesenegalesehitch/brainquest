import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }
            if (id.includes('clsx') || id.includes('tailwind') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }

          // Feature chunks
          if (id.includes('src/contexts/AuthContext') || id.includes('src/components/auth')) {
            return 'auth';
          }
          if (id.includes('src/pages/AdminPage') || id.includes('src/hooks/useAdminData')) {
            return 'admin';
          }
          if (id.includes('src/components/puzzles') || id.includes('src/types/puzzle')) {
            return 'puzzles';
          }
          if (id.includes('src/components/security') || id.includes('src/utils/security')) {
            return 'security';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
}));
