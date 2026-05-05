"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import RequireAuth from "../components/auth/RequireAuth";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/wines")
      .then((r) => r.json())
      .then((wines) => {
        setStats({
          total: wines.length,
          available: wines.filter((w) => w.status === "available").length,
          soldout: wines.filter((w) => w.status === "soldout").length,
          ordered: wines.filter((w) => w.status === "ordered").length,
          trial: wines.filter((w) => w.status === "trial").length,
        });
      });
  }, []);

  return (
    <RequireAuth role="admin">
      <div>
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
          </div>

          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Vini totali</span>
              </div>
              <div className="stat-card stat-available">
                <span className="stat-value">{stats.available}</span>
                <span className="stat-label">Disponibili</span>
              </div>
              <div className="stat-card stat-soldout">
                <span className="stat-value">{stats.soldout}</span>
                <span className="stat-label">Terminati</span>
              </div>
              <div className="stat-card stat-ordered">
                <span className="stat-value">{stats.ordered}</span>
                <span className="stat-label">Ordinati</span>
              </div>
              <div className="stat-card stat-trial">
                <span className="stat-value">{stats.trial}</span>
                <span className="stat-label">In prova</span>
              </div>
            </div>
          )}

          <div className="dashboard-actions">
            <button
              className="btn btn-primary"
              onClick={() => router.push("/admin/wine")}
            >
              🍷 Gestisci vini
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/menu")}
            >
              👁️ Anteprima menu
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}