

"use client";
 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/useAuth";
 
export default function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/"); return; }
    if (role && user.role !== role) {
      router.push(user.role === "admin" ? "/admin" : "/menu");
    }
  }, [user, loading, role]);
 
  if (loading) return <div className="loading">Caricamento…</div>;
  if (!user) return null;
  if (role && user.role !== role) return null;
 
  return children;
}