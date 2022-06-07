/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { loadToken, saveToken, logoutUser } from '../helpers/storage';
import { api } from '../services/api';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const signIn = async (userDataInput) => {
    try {
      const response = await api.post('auth/signIn', userDataInput);

      // Deserialize and save token received from the server
      const { data } = response.data;
      const rToken = data.token;
      saveToken(rToken);
      setToken(rToken);

      // returns an empty string indicating that there was no error
      return '';
    } catch (error) {
      // returns an error message to show
      return error.response.data.message;
    }
  };

  const signUp = async (userDataInput) => {
    try {
      const response = await api.post('auth/signUp', userDataInput);
      const { data } = response;
      return data.message;
    } catch (error) {
      // returns an error message to show
      return error.response.data.message;
    }
  };

  const signOut = () => {
    logoutUser();
    setToken(null);
    setUserInfo(null);
  };

  useEffect(() => {
    api.defaults.headers.common = token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Signout user if receives an unauthorized code
  useEffect(() => {
    setToken(loadToken);

    const responseInterceptor = api.interceptors.response.use((response) => response, (error) => {
      if (error.response.status === 401) {
        signOut();
      }
      return Promise.reject(error);
    });

    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  return (
    <AuthContext.Provider value={
      {
        token, signIn, signUp, signOut, userInfo, setUserInfo,
      }
    }
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside a AuthProvider');
  }
  return context;
}

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.token) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  return children;
}

export default AuthProvider;
