import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log environment details for debugging
  console.log('Current Mode:', mode);

  return {
    plugins: [react()],
    base: "/pkmn_analyzer/",
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
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        process.env.VITE_BACKEND_URL || 
        env.VITE_BACKEND_URL || 
        ''
      )
    }
  }
})