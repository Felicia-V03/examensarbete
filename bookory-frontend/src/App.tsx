import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@bookory-frontend/auth-context';
import { ProtectedRoute } from '@bookory-frontend/protected-route';
import { StartPage } from '@bookory-frontend/startpage';
import { LoginPage } from '@bookory-frontend/loginpage';
import { RegisterPage } from '@bookory-frontend/registerpage';
import { HomePage } from '@bookory-frontend/homepage';
import { SearchPage } from '@bookory-frontend/searchpage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Publika routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Skyddade routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App