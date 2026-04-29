"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="portal">
      <h1>🍷 Wine Manager</h1>
      <p>Sistema gestione magazzino ristorante</p>

      <div className="portal-grid">

        <div className="card">
          <h2>👤 Ospite</h2>
          <p>Consulta la carta vini</p>
          <button className="btn btn-primary" onClick={() => router.push("/menu")}>
            Entra
          </button>
        </div>

        <div className="card">
          <h2>🔐 Admin</h2>
          <p>Gestione magazzino</p>
          <button className="btn btn-secondary" onClick={() => router.push("/admin")}>
            Accedi
          </button>
        </div>

      </div>
    </main>
  );
}