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

      
      // Core
      '@bookory-frontend/user': resolve(__dirname, 'packages/core/interfaces/user/index.ts'),
      '@bookory-frontend/login': resolve(__dirname, 'packages/core/interfaces/login/index.ts'),
      '@bookory-frontend/book': resolve(__dirname, 'packages/core/interfaces/book/index.ts'),
      '@bookory-frontend/button': resolve(__dirname, 'packages/core/interfaces/button/index.ts'),
      '@bookory-frontend/auth-store': resolve(__dirname, 'packages/core/store/useauth-store/data/index.ts'),
      '@bookory-frontend/useauth-token': resolve(__dirname, 'packages/core/hooks/useauth-token/index.ts'),
      '@bookory-frontend/book-api': resolve(__dirname, 'packages/core/api/book-api/index.ts'),
      
      

      // Base Components
      '@bookory-frontend/base-button': resolve(__dirname, 'packages/base/button/ui/index.tsx'),
      '@bookory-frontend/base-loading': resolve(__dirname, 'package/base/loading/ui/index.tsx'),
      '@bookory-frontend/protected-route': resolve(__dirname, 'packages/base/protected-route/ui/index.tsx'),
      '@bookory-frontend/auth-card': resolve(__dirname, 'packages/base/auth/auth-card/ui/index.tsx'),
      '@bookory-frontend/auth-taps': resolve(__dirname, 'packages/base/auth/auth-taps/ui/index.tsx'),
      '@bookory-frontend/login-form': resolve(__dirname, 'packages/base/loginForm/ui/index.tsx'),
      '@bookory-frontend/search-input': resolve(__dirname, 'packages/base/search/search-input/ui/index.tsx'),
      '@bookory-frontend/search-results': resolve(__dirname, 'packages/base/search/search-results/ui/index.tsx'),
      '@bookory-frontend/book-card': resolve(__dirname, 'packages/base/book-card/ui/index.ts'),
      '@bookory-frontend/book-list': resolve(__dirname, 'packages/base/book-list/ui/index.ts'),
    }
  }
})
