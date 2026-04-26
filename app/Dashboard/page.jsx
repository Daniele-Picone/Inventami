"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totale: 0,
    scorteBasse: 0,
    valore: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inventario");
        const data = await res.json();

        const totale = data.length;
        const scorteBasse = data.filter(
          (a) => a.quantita <= a.sogliaMinimaAlert
        ).length;

        const valore = data.reduce(
          (acc, a) => acc + (a.quantita || 0) * (a.prezzoUnitario || 0),
          0
        );

        setStats({ totale, scorteBasse, valore });
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ marginBottom: 20 }}>📊 Dashboard</h1>

      {/* STAT CARDS */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card titolo="Articoli Totali" valore={stats.totale} />
        <Card titolo="Scorte Basse" valore={stats.scorteBasse} alert />
        <Card
          titolo="Valore Magazzino"
          valore={`€ ${stats.valore.toFixed(2)}`}
        />
      </div>

      {/* AZIONI RAPIDE */}
      <h2 style={{ marginTop: 40 }}>⚡ Azioni rapide</h2>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
        <Button onClick={() => router.push("/inventari/food")}>
          🍝 Food
        </Button>

        <Button onClick={() => router.push("/inventari/beverage")}>
          🥤 Beverage
        </Button>

        <Button onClick={() => router.push("/inventari/wine")}>
          🍷 Wine
        </Button>

        <Button onClick={() => router.push("/import")}>
          📥 Import Excel
        </Button>

        <Button onClick={() => router.push("/articolo/nuovo")} primary>
          + Nuovo Articolo
        </Button>
      </div>

      {/* ALERT */}
      {stats.scorteBasse > 0 && (
        <div
          style={{
            marginTop: 30,
            padding: 15,
            background: "#ffe5e5",
            borderRadius: 8,
          }}
        >
          ⚠️ Attenzione: hai {stats.scorteBasse} articoli con scorte basse
        </div>
      )}
    </div>
  );
}

function Card({ titolo, valore, alert }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        background: "white",
        minWidth: 180,
        border: alert ? "2px solid red" : "1px solid #eee",
      }}
    >
      <p style={{ fontSize: 14, color: "#666" }}>{titolo}</p>
      <h2>{valore}</h2>
    </div>
  );
}

function Button({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: "none",
        background: primary ? "black" : "#f3f3f3",
        color: primary ? "white" : "black",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}