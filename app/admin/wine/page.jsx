"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";

const EMPTY_WINE = {
  name: "",
  cellar: "",
  year: "",
  type: "",
  status: "",
  purchasePrice: "",
  sellPrice: "",
  locationType: "italy",
  country: "",
  region: "",
};

const buildWine = (wine) => ({
  id: wine.id || Date.now(),
  name: wine.name || "",
  cellar: wine.cellar || "",
  year: wine.year ? Number(wine.year) : "",
  type: wine.type || "",
  status: wine.status || "available",
  purchasePrice: wine.purchasePrice ? Number(wine.purchasePrice) : 0,
  sellPrice: wine.sellPrice ? Number(wine.sellPrice) : 0,
  locationType: wine.locationType || "italy",
  country: wine.country || "",
  region: wine.region || "",
});

export default function WinesAdmin() {
  const [wines, setWines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newWine, setNewWine] = useState(EMPTY_WINE);

  const load = async () => {
    const res = await fetch("/api/wines");
    const data = await res.json();
    setWines(data.map(buildWine));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (id, field, value) => {
    setWines((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleLocationType = (id, value) => {
    setWines((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              locationType: value,
              country: value === "italy" ? "" : w.country,
            }
          : w
      )
    );
  };

  const saveWine = async (wine) => {
    await fetch("/api/wines", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWine(wine)),
    });

    setEditingId(null);
    load();
  };

  const addWine = async () => {
    if (!newWine.name) return;

    await fetch("/api/wines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWine(newWine)),
    });

    setNewWine(EMPTY_WINE);
    load(); // ← fix: ricarica dal server invece di usare la risposta
  };

  const WineRow = ({ w, isEditing }) => {
    const dis = !isEditing;

    return (
      <div className={`table-row excel ${isEditing ? "editing" : "view-mode"}`}>

        <input
          placeholder="Nome vino"
          value={w.name}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "name", e.target.value)}
        />

        <input
          placeholder="Cantina"
          value={w.cellar}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "cellar", e.target.value)}
        />

        <input
          type="number"
          placeholder="Anno"
          value={w.year}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "year", e.target.value)}
        />

        <select
          value={w.type}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "type", e.target.value)}
        >
          <option value="">Tipo</option>
          <option value="bianco">Bianco</option>
          <option value="rosso">Rosso</option>
          <option value="rosato">Rosato</option>
        </select>

        <select
          value={w.status}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "status", e.target.value)}
        >
          <option value="">Stato</option>
          <option value="available">Disponibile</option>
          <option value="soldout">Terminato</option>
          <option value="ordered">Ordinato</option>
          <option value="trial">In prova</option>
        </select>

        <input
          type="number"
          placeholder="€ acquisto"
          value={w.purchasePrice}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "purchasePrice", e.target.value)}
        />

        <input
          type="number"
          placeholder="€ vendita"
          value={w.sellPrice}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "sellPrice", e.target.value)}
        />

        <select
          value={w.locationType}
          disabled={dis}
          onChange={(e) => handleLocationType(w.id, e.target.value)}
        >
          <option value="italy">🇮🇹 Italia</option>
          <option value="foreign">🌍 Estero</option>
        </select>

        <input
          placeholder={w.locationType === "foreign" ? "Paese..." : "Italia"}
          value={w.country}
          disabled={dis || w.locationType === "italy"}
          onChange={(e) => handleChange(w.id, "country", e.target.value)}
        />

        <input
          placeholder="Regione"
          value={w.region}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "region", e.target.value)}
        />

        <div className="cell-actions">
          {isEditing ? (
            <button className="btn btn-save" onClick={() => saveWine(w)}>
              💾
            </button>
          ) : (
            <button
              className="btn btn-edit"
              onClick={() => setEditingId(w.id)}
            >
              ✏️
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />

      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">🍷 Gestione Vini</h1>
        </div>

        <div className="table-scroll">

          <div className="table-row table-head excel">
            <span>Nome</span>
            <span>Cantina</span>
            <span>Anno</span>
            <span>Tipo</span>
            <span>Stato</span>
            <span>Acquisto</span>
            <span>Vendita</span>
            <span>Loc.</span>
            <span>Paese</span>
            <span>Regione</span>
            <span></span>
          </div>

          {wines.map((w) => (
            <WineRow
              key={w.id}
              w={w}
              isEditing={editingId === w.id}
            />
          ))}

          <div className="table-row excel add-row">

            <input
              placeholder="+ Nome vino"
              value={newWine.name}
              onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
            />

            <input
              placeholder="Cantina"
              value={newWine.cellar}
              onChange={(e) => setNewWine({ ...newWine, cellar: e.target.value })}
            />

            <input
              type="number"
              placeholder="Anno"
              value={newWine.year}
              onChange={(e) => setNewWine({ ...newWine, year: e.target.value })}
            />

            <select
              value={newWine.type}
              onChange={(e) => setNewWine({ ...newWine, type: e.target.value })}
            >
              <option value="">Tipo</option>
              <option value="bianco">Bianco</option>
              <option value="rosso">Rosso</option>
              <option value="rosato">Rosato</option>
            </select>

            <select
              value={newWine.status}
              onChange={(e) => setNewWine({ ...newWine, status: e.target.value })}
            >
              <option value="">Stato</option>
              <option value="available">Disponibile</option>
              <option value="soldout">Terminato</option>
              <option value="ordered">Ordinato</option>
              <option value="trial">In prova</option>
            </select>

            <input
              type="number"
              placeholder="€ acquisto"
              value={newWine.purchasePrice}
              onChange={(e) => setNewWine({ ...newWine, purchasePrice: e.target.value })}
            />

            <input
              type="number"
              placeholder="€ vendita"
              value={newWine.sellPrice}
              onChange={(e) => setNewWine({ ...newWine, sellPrice: e.target.value })}
            />

            <select
              value={newWine.locationType}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  locationType: e.target.value,
                  country: e.target.value === "italy" ? "" : newWine.country,
                })
              }
            >
              <option value="italy">🇮🇹 Italia</option>
              <option value="foreign">🌍 Estero</option>
            </select>

            <input
              placeholder={newWine.locationType === "foreign" ? "Paese..." : "Italia"}
              value={newWine.country}
              disabled={newWine.locationType === "italy"}
              onChange={(e) => setNewWine({ ...newWine, country: e.target.value })}
            />

            <input
              placeholder="Regione"
              value={newWine.region}
              onChange={(e) => setNewWine({ ...newWine, region: e.target.value })}
            />

            <div className="cell-actions">
              <button className="btn btn-add" onClick={addWine}>
                ＋
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}