import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
  host: '0.0.0.0',
  port: 5173,
},
  // server: {
  //   host: '127.0.0.1',
  //   port: 5173,
  // },
  plugins: [
    tailwindcss(),
    react(),
  ],
})