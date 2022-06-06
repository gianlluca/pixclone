import { RouterManager } from './Router';
import AuthProvider from './hooks/useAuth';
import { GlobalStyle } from './GlobalStyle';

export default function App() {
  return (
    <AuthProvider>
      <RouterManager />
      <GlobalStyle />
    </AuthProvider>
  );
}
