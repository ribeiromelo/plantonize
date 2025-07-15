import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userInfo, setUserInfo] = useState(null);

  const login = (tokenData, user) => {
    setToken(tokenData);
    setUserInfo(user);
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    // opcional: carregar dados do usuário com token
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
