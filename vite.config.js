import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @mediapipe/pose isn't real ESM; this app only uses MoveNet, so the
      // unused BlazePose import path is stubbed out. See src/shims for why.
      '@mediapipe/pose': fileURLToPath(new URL('./src/shims/mediapipe-pose-shim.js', import.meta.url)),
    },
  },
})
