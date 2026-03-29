/**
 * App.tsx – rot-komponenten som definierar applikationens routing.
 * Publika routes: /, /login, /register.
 * Skyddade routes (kräver inloggning): /home, /search, /profile – rendereras inuti Layout.
 */
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@bookory-frontend/protected-route';
import { Layout } from '@bookory-frontend/layout';
import { StartPage } from '@bookory-frontend/startpage';
import { LoginPage } from '@bookory-frontend/loginpage';
import { RegisterPage } from '@bookory-frontend/registerpage';
import { HomePage } from '@bookory-frontend/homepage';
import { SearchPage } from '@bookory-frontend/searchpage';
import { ProfilePage } from '@bookory-frontend/profilepage';
import { DetailPage } from '@bookory-frontend/detailpage';
import { ShelfPage } from '@bookory-frontend/shelfpage';

function App() {
  return (
    <Routes>
      {/* Publika routes */}
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/detail/:bookId" element={<DetailPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />          
        </Route>
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
      </Route>
    </Routes>
  );
}

export default App
