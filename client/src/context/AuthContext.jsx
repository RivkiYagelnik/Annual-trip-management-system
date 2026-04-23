import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login as loginApi } from "../api/auth.api";

const AuthContext = createContext(null);

function getStoredAuth() {
  const stored = localStorage.getItem("token");
  if (!stored) return { token: null, user: null };

  try {
    const decoded = jwtDecode(stored);

    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return { token: null, user: null };
    }

    return { token: stored, user: decoded };
  } catch {
    localStorage.removeItem("token");
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const initialAuth = getStoredAuth();

  const [token, setToken] = useState(initialAuth.token);
  const [user,  setUser]  = useState(initialAuth.user);

  const login = async (idNumber, password) => {
    const res = await loginApi(idNumber, password);
    const { token: newToken } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);