"use client";

import { useEffect, useState } from "react";

export default function Menu() {
  const [wines, setWines] = useState([]);

  useEffect(() => {
    fetch("/api/wines")
      .then(res => res.json())
      .then(data =>
        setWines(data.filter(w => w.status === "available"))
      );
  }, []);

  return (
    <main className="portal">
      <h1>🍷 Carta dei Vini</h1>

      <div className="portal-grid">
        {wines.map(w => (
          <div className="card" key={w.id}>
            <h3>{w.name}</h3>

            <p>{w.type} • {w.year}</p>

            <p style={{ fontWeight: "bold" }}>
              € {w.sellPrice}
            </p>

            <small>
              {w.cellar} • {w.region}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}