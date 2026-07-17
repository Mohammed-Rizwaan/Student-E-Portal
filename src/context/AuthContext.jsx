import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyUsers } from '../data/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear session on reload or startup to force starting from the login page
    localStorage.removeItem('mentorconnect_user');
    setCurrentUser(null);
    setLoading(false);
  }, []);

  const login = (userId, password) => {
    const user = dummyUsers.find(
      (u) => u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
    );
    if (user) {
      // Create user details payload
      const payload = {
        id: user.userId,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      };
      setCurrentUser(payload);
      localStorage.setItem('mentorconnect_user', JSON.stringify(payload));
      return { success: true };
    }
    return { success: false, message: "Invalid User ID or Password" };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mentorconnect_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
