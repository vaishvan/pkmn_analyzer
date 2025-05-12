import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log environment details for debugging
  console.log('Current Mode:', mode);
  console.log('Loaded Environment Variables:', env);

  return {
    plugins: [react()],
    base: "/PKMN_ANALYZER",
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist'
    },
    // Define environment variables for client-side
    define: {
      'import.meta.env.VITE_GOOGLE_GEMINI_API_KEY': JSON.stringify(
        process.env.VITE_GOOGLE_GEMINI_API_KEY || 
        env.VITE_GOOGLE_GEMINI_API_KEY || 
        ''
      )
    }
  }
})