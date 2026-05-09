import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Cloud-synced folders (e.g. OneDrive) can miss native FS events.
    // Polling keeps HMR/file watching reliable for local development.
    watch: {
      usePolling: true,
      interval: 120,
    },
  },
})
