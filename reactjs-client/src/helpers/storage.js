export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const loadToken = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return token;
  }

  return null;
};

export const logoutUser = () => { localStorage.removeItem('token'); };
