import { createContext, useContext, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!localStorage.getItem("token");

  const loginVet = async ({ password }) => {
    const res = await api.post("/auth/login/vet", { password });

    const token = res.data?.token;
    if (!token) throw new Error("Token gelmedi (loginVet response kontrol)");

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ role: "vet" }));
    setUser({ role: "vet" });

    return res.data;
  };

  const loginCustomer = async ({ customerId }) => {
    const res = await api.post("/auth/login/customer", { customerId });

    const token = res.data?.token;
    if (!token) throw new Error("Token gelmedi (loginCustomer response kontrol)");

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ role: "customer", customerId }));
    setUser({ role: "customer", customerId });

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated, loginVet, loginCustomer, logout }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
