import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Pages
      '@bookory-frontend/homepage': resolve(__dirname, 'packages/pages/homepage/ui/index.tsx'),
      '@bookory-frontend/startpage': resolve(__dirname, 'packages/pages/startpage/ui/index.tsx'),
      '@bookory-frontend/loginpage': resolve(__dirname, 'packages/pages/loginpage/ui/index.tsx'),
      '@bookory-frontend/registerpage': resolve(__dirname, 'packages/pages/registerpage/ui/index.tsx'),
      '@bookory-frontend/searchpage': resolve(__dirname, 'packages/pages/searchpage/ui/index.tsx'),

      // Core hooks


      // Core
      '@bookory-frontend/user': resolve(__dirname, 'packages/core/interfaces/user/index.ts'),

      // Base Components
    }
  }
})
