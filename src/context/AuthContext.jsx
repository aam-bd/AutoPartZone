import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on initial boot
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('AuthContext useEffect - storedUser:', storedUser);
    console.log('AuthContext useEffect - token:', storedToken);
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        console.log('AuthContext - user and token set successfully');
      } catch (error) {
        console.error("Failed to parse user", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    console.log('AuthContext login - userData:', userData);
    console.log('AuthContext login - token:', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setToken(token);
    console.log('Token stored in localStorage:', localStorage.getItem('token'));
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  console.log('useAuth called, returning context:', context);
  return context;
};