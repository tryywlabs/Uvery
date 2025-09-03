import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    // console.log('AuthProvider: Token found:', !!token);
    // console.log('AuthProvider: UserData found:', !!userData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // console.log('AuthProvider: Setting user as authenticated:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    } else {
      console.log('AuthProvider: No valid authentication found');
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // console.log('AuthProvider: Login called with:', userData, token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    // console.log('AuthProvider: User logged in successfully');
  };

  const logout = () => {
    // console.log('AuthProvider: Logout called');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    // console.log('AuthProvider: User logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  // console.log('AuthProvider: Current state -', {
  //   isAuthenticated,
  //   user: user?.email,
  //   loading,
  // });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
