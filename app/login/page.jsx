"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/useAuth";
 
export default function Home() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
 
  // Se già loggato, manda alla pagina giusta
  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === "admin" ? "/admin" : "/menu");
    }
  }, [user, loading]);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const role = await login(username, password);
      router.push(role === "admin" ? "/admin" : "/menu");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
 
  if (loading) return <div className="loading">Caricamento…</div>;
 
  return (
    <main className="portal">
      <div className="portal-hero">
        <span className="portal-icon">🍷</span>
        <h1>Wine Manager</h1>
        <p>Sistema gestione magazzino ristorante</p>
      </div>
 
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Utente</label>
          <input
            id="username"
            type="text"
            placeholder="admin / ospite"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
 
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
 
        {error && <p className="form-error">{error}</p>}
 
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Accesso…" : "Accedi"}
        </button>
      </form>
 
      <p className="portal-hint">
        Admin: <code>admin / admin123</code> &nbsp;|&nbsp; Ospite: <code>ospite / ospite123</code>
      </p>
    </main>
  );
}