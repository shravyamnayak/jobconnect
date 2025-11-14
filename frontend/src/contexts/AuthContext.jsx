import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth")) || null;
    } catch {
      return null;
    }
  });

  // Save to localStorage whenever auth changes
  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  // login() expects: { token, email, roles }
  const login = ({ token, email, roles }) => {
    setAuth({ token, email, roles });
  };

  const logout = () => {
    setAuth(null);
  };

  const hasRole = (roleName) => {
    if (!auth?.roles) return false;
    return (
      auth.roles.includes(roleName) ||
      auth.roles.includes(`ROLE_${roleName}`) ||
      auth.roles.includes(roleName.toUpperCase())
    );
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
