"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getInventari,
  addInventario,
  updateInventario,
  deleteInventario
} from "../../lib/inventariStore";

export default function InventariPage() {
  const router = useRouter();
  const [inventari, setInventari] = useState([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    setInventari(getInventari());
  }, []);

  const crea = () => {
    if (!nome) return;

    addInventario(nome);
    setInventari(getInventari());
    setNome("");
  };

  const modifica = (inv) => {
    const nuovo = prompt("Nuovo nome:", inv.nome);
    if (!nuovo) return;

    updateInventario(inv.id, nuovo);
    setInventari(getInventari());
  };

  const elimina = (id) => {
    if (!confirm("Eliminare inventario?")) return;

    deleteInventario(id);
    setInventari(getInventari());
  };

  return (
    <div className="container">
      <h1>📦 Inventari</h1>

      {/* CREA */}
      <div className="card mt-20">
        <h3>Nuovo inventario</h3>

        <div className="flex mt-20">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome inventario..."
          />

          <button className="btn btn-primary" onClick={crea}>
            + Crea
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid mt-20">
        {inventari.map((inv) => (
          <div
            key={inv.id}
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/inventary/${inv.slug}`)}
          >
            <h3>{inv.nome}</h3>

            <div className="flex mt-20">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  modifica(inv);
                }}
              >
                ✏️
              </button>

              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  elimina(inv.id);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}