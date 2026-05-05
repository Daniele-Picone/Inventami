"use client";
 
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { role, username } | null
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth");

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      if (data?.authenticated) {
        setUser({
          role: data.role,
          username: data.username,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);
 
  const login = async (username, password) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
 
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Errore login");
    }
 
    const data = await res.json();
    setUser({ role: data.role, username: data.username });
    return data.role;
  };
 
  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setUser(null);
    router.push("/");
  };
 
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}