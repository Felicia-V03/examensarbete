/**
 * App.tsx – rot-komponenten som definierar applikationens routing.
 * Publika routes: /, /login, /register.
 * Skyddade routes (kräver inloggning): /home, /search, /profile – rendereras inuti Layout.
 *
 * Modal-pattern: Om location.state.backgroundLocation finns renderas föregående sida
 * i bakgrunden och DetailPage visas som modal ovanpå.
 */
import { Routes, Route, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  // Om state innehåller backgroundLocation visas den sidan i bakgrunden (modal-läge)
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      {/* Huvud-routes: renderas med backgroundLocation när modal är aktiv */}
      <Routes location={backgroundLocation ?? location}>
        {/* Publika routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Fallback: direktlänk till detail (t.ex. reload) – renderas som egen sida */}
          <Route path="/detail/:bookId" element={<DetailPage />} />
        </Route>
      </Routes>

      {/* Modal-route: renderas ovanpå bakgrundssidan när backgroundLocation finns */}
      {backgroundLocation && (
        <Routes>
          <Route path="/detail/:bookId" element={<DetailPage />} />
        </Routes>
      )}
    </>
  );
}

export default App
