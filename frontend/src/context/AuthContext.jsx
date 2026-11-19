import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    username: 'Security Auditor',
    role: 'AUDITOR',
    email: 'auditor@cybershield.local',
  });

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
