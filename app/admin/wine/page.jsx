"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";

const EMPTY_WINE = {
  name: "", cellar: "", year: "", type: "", status: "",
  purchasePrice: "", sellPrice: "", locationType: "italy",
  country: "", region: "",
};

export default function WinesAdmin() {
  const [wines, setWines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newWine, setNewWine] = useState(EMPTY_WINE);

  const load = async () => {
    const res = await fetch("/api/wines");
    const data = await res.json();
    setWines(data);
  };

  useEffect(() => { load(); }, []);

  // Aggiorna campo in una riga esistente (solo locale finché non si salva)
  const handleChange = (id, field, value) => {
    setWines((prev) =>
      prev.map((w) => w.id === id ? { ...w, [field]: value } : w)
    );
  };

  // Aggiorna locationType e resetta country se si torna a italy
  const handleLocationType = (id, value) => {
    setWines((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, locationType: value, country: value === "italy" ? "" : w.country }
          : w
      )
    );
  };

  // Salva la riga editata sul backend
  const saveWine = async (wine) => {
    await fetch("/api/wines", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wine),
    });
    setEditingId(null);
  };

  // Aggiunge un nuovo vino
  const addWine = async () => {
    if (!newWine.name) return;
    const res = await fetch("/api/wines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWine),
    });
    const created = await res.json();
    setWines((prev) => [...prev, created]);
    setNewWine(EMPTY_WINE);
  };

  const WineRow = ({ w, isEditing }) => {
    const dis = !isEditing;
    return (
      <div className={`table-row excel ${isEditing ? "editing" : "view-mode"}`} key={w.id}>
        <input
          placeholder="Nome vino" value={w.name || ""}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "name", e.target.value)}
        />
        <input
          placeholder="Cantina" value={w.cellar || ""}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "cellar", e.target.value)}
        />
        <input
          type="number" placeholder="Anno" value={w.year || ""}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "year", Number(e.target.value))}
        />
        <select value={w.type || ""} disabled={dis}
          onChange={(e) => handleChange(w.id, "type", e.target.value)}>
          <option value="">Tipo</option>
          <option value="bianco">Bianco</option>
          <option value="rosso">Rosso</option>
          <option value="rosato">Rosato</option>
        </select>
        <select value={w.status || ""} disabled={dis}
          onChange={(e) => handleChange(w.id, "status", e.target.value)}>
          <option value="">Stato</option>
          <option value="available">Disponibile</option>
          <option value="soldout">Terminato</option>
          <option value="ordered">Ordinato</option>
          <option value="trial">In prova</option>
        </select>
        <input
          type="number" placeholder="€ acquisto" value={w.purchasePrice || ""}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "purchasePrice", Number(e.target.value))}
        />
        <input
          type="number" placeholder="€ vendita" value={w.sellPrice || ""}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "sellPrice", Number(e.target.value))}
        />
        <select value={w.locationType || "italy"} disabled={dis}
          onChange={(e) => handleLocationType(w.id, e.target.value)}>
          <option value="italy">🇮🇹 Italia</option>
          <option value="foreign">🌍 Estero</option>
        </select>
        <input
          placeholder={w.locationType === "foreign" ? "Paese..." : "Italia"}
          value={w.country || ""}
          disabled={dis || (w.locationType || "italy") === "italy"}
          style={{ opacity: (w.locationType || "italy") === "italy" ? 0.4 : 1 }}
          onChange={(e) => handleChange(w.id, "country", e.target.value)}
        />
        <input
          placeholder="Regione" value={w.region || ""}
          disabled={dis}
          onChange={(e) => handleChange(w.id, "region", e.target.value)}
        />

        {/* AZIONI */}
        <div className="cell-actions">
          {isEditing ? (
            <button className="btn btn-save" title="Salva" onClick={() => saveWine(w)}>
              💾
            </button>
          ) : (
            <button className="btn btn-edit" title="Modifica" onClick={() => setEditingId(w.id)}>
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

          {/* HEADER */}
          <div className="table-row table-head excel">
            <span>Nome</span><span>Cantina</span><span>Anno</span><span>Tipo</span>
            <span>Stato</span><span>Acquisto</span><span>Vendita</span><span>Loc.</span>
            <span>Paese</span><span>Regione</span><span></span>
          </div>

          {/* RIGHE ESISTENTI */}
          {wines.map((w) => (
            <WineRow key={w.id} w={w} isEditing={editingId === w.id} />
          ))}

          {/* RIGA AGGIUNGI */}
          <div className="table-row excel add-row">
            <input placeholder="+ Nome vino" value={newWine.name}
              onChange={(e) => setNewWine({ ...newWine, name: e.target.value })} />
            <input placeholder="Cantina" value={newWine.cellar}
              onChange={(e) => setNewWine({ ...newWine, cellar: e.target.value })} />
            <input type="number" placeholder="Anno" value={newWine.year}
              onChange={(e) => setNewWine({ ...newWine, year: Number(e.target.value) })} />
            <select value={newWine.type}
              onChange={(e) => setNewWine({ ...newWine, type: e.target.value })}>
              <option value="">Tipo</option>
              <option value="bianco">Bianco</option>
              <option value="rosso">Rosso</option>
              <option value="rosato">Rosato</option>
            </select>
            <select value={newWine.status}
              onChange={(e) => setNewWine({ ...newWine, status: e.target.value })}>
              <option value="">Stato</option>
              <option value="available">Disponibile</option>
              <option value="soldout">Terminato</option>
              <option value="ordered">Ordinato</option>
              <option value="trial">In prova</option>
            </select>
            <input type="number" placeholder="€ acquisto" value={newWine.purchasePrice}
              onChange={(e) => setNewWine({ ...newWine, purchasePrice: Number(e.target.value) })} />
            <input type="number" placeholder="€ vendita" value={newWine.sellPrice}
              onChange={(e) => setNewWine({ ...newWine, sellPrice: Number(e.target.value) })} />
            <select value={newWine.locationType}
              onChange={(e) => setNewWine({
                ...newWine,
                locationType: e.target.value,
                country: e.target.value === "italy" ? "" : newWine.country,
              })}>
              <option value="italy">🇮🇹 Italia</option>
              <option value="foreign">🌍 Estero</option>
            </select>
            <input
              placeholder={newWine.locationType === "foreign" ? "Paese..." : "Italia"}
              value={newWine.country}
              disabled={newWine.locationType === "italy"}
              style={{ opacity: newWine.locationType === "italy" ? 0.4 : 1 }}
              onChange={(e) => setNewWine({ ...newWine, country: e.target.value })}
            />
            <input placeholder="Regione" value={newWine.region}
              onChange={(e) => setNewWine({ ...newWine, region: e.target.value })} />
            <div className="cell-actions">
              <button className="btn btn-add" title="Aggiungi vino" onClick={addWine}>
                ＋
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}