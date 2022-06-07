import {
  Routes, Route, BrowserRouter,
} from 'react-router-dom';
import { Header } from './components/Header';
import { RequireAuth } from './hooks/useAuth';
import { DashboardPage } from './pages/Dashboard';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

export function RouterManager() {
  const dashboard = (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={dashboard} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={dashboard} />
      </Routes>
    </BrowserRouter>
  );
}
