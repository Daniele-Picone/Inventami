"use client";

import Header from "./components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="container">

        {/* TITOLO */}
        <h1 className="mb-20">📊 Dashboard</h1>

        {/* STAT CARDS */}
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))" }}>
          
          <div className="card">
            <p>Articoli totali</p>
            <h2>120</h2>
          </div>

          <div className="card">
            <p>Scorte basse</p>
            <h2 style={{ color: "red" }}>5</h2>
          </div>

          <div className="card">
            <p>Valore magazzino</p>
            <h2>€ 2.450</h2>
          </div>

        </div>

        {/* AZIONI */}
        <h2 className="mt-20 mb-20">⚡ Azioni rapide</h2>

        <div className="flex">

          <button className="btn btn-primary" onClick={() => router.push("/inventari/food")}>
            🍝 Food
          </button>

          <button className="btn btn-secondary" onClick={() => router.push("/inventari/beverage")}>
            🥤 Beverage
          </button>

          <button className="btn btn-secondary" onClick={() => router.push("/inventari/wine")}>
            🍷 Wine
          </button>

          <button className="btn btn-secondary" onClick={() => router.push("/import")}>
            📥 Import Excel
          </button>

        </div>

        {/* ALERT */}
        <div className="alert mt-20">
          ⚠️ Hai 5 articoli sotto la soglia minima
        </div>

      </main>
    </>
  );
}