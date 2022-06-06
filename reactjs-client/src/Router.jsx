import {
  Routes, Route, BrowserRouter,
} from 'react-router-dom';
import { Header } from './components/Header';
import { RequireAuth } from './hooks/useAuth';
import { DashboardPage } from './pages/Dashboard';
import { HomePage } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

export function RouterManager() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={(
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}
