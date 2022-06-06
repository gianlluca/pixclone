import { Navigate, useLocation } from 'react-router-dom';

export function HomePage() {
  const location = useLocation();

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
}
