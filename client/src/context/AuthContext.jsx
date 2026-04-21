import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // npm install jwt-decode
import { login as loginApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user,  setUser]  = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? jwtDecode(stored) : null;
  });

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