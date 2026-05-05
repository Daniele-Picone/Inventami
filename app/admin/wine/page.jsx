"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/layout/Navbar";

const EMPTY_WINE = {
  name: "",
  cellar: "",
  year: "",
  type: "",
  status: "available",
  purchasePrice: "",
  sellPrice: "",
  locationType: "italy",
  country: "",
  region: "",
};

const EMPTY_INFO = {
  grapes: "",       // uvaggi
  notes: "",        // note libere
  servingTemp: "",  // temperatura di servizio
  pairings: "",     // abbinamenti
  organic: false,   // biologico
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
  info: wine.info || EMPTY_INFO,
});

// ── Kebab Menu ──────────────────────────────────────────────────────────────
function KebabMenu({ wine, onRemoveFromMenu, onOpenInfo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isOffMenu = wine.status === "soldout";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="btn btn-kebab"
        onClick={() => setOpen((v) => !v)}
        title="Opzioni"
      >
        ⋮
      </button>

      {open && (
        <div className="kebab-dropdown">
          <button
            className="kebab-item"
            onClick={() => {
              onRemoveFromMenu(wine, isOffMenu ? "available" : "soldout");
              setOpen(false);
            }}
          >
            {isOffMenu ? "✅ Rimetti in menu" : "🚫 Togli da menu"}
          </button>

          <div className="kebab-divider" />

          <button
            className="kebab-item"
            onClick={() => {
              onOpenInfo(wine);
              setOpen(false);
            }}
          >
            📝 Aggiungi informazioni
          </button>
        </div>
      )}
    </div>
  );
}

// ── Info Modal ───────────────────────────────────────────────────────────────
function InfoModal({ wine, onClose, onSave }) {
  const [info, setInfo] = useState(wine.info || EMPTY_INFO);

  const field = (key, label, placeholder, type = "text") => (
    <div className="info-field">
      <label>{label}</label>
      {key === "notes" || key === "pairings" ? (
        <textarea
          value={info[key]}
          placeholder={placeholder}
          rows={3}
          onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
        />
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          checked={info[key]}
          onChange={(e) => setInfo({ ...info, [key]: e.target.checked })}
        />
      ) : (
        <input
          type={type}
          value={info[key]}
          placeholder={placeholder}
          onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 {wine.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {field("grapes",      "Uvaggi",               "es. Sangiovese 85%, Canaiolo 15%")}
          {field("servingTemp", "Temperatura servizio",  "es. 16–18°C")}
          {field("pairings",    "Abbinamenti",           "es. Bistecca, formaggi stagionati...")}
          {field("notes",       "Note libere",           "Descrizione, storia, curiosità...")}
          <div className="info-field info-field--checkbox">
            <label>🌿 Biologico / Naturale</label>
            {field("organic", "", "", "checkbox")}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-save" onClick={() => onSave(wine.id, info)}>
            💾 Salva
          </button>
          <button className="btn btn-cancel" onClick={onClose}>
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function WinesAdmin() {
  const [wines, setWines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newWine, setNewWine] = useState(EMPTY_WINE);
  const [infoWine, setInfoWine] = useState(null); // wine aperto nel modal

  const load = async () => {
    const res = await fetch("/api/wines");
    const data = await res.json();
    setWines(data.map(buildWine));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (id, field, value) => {
    setWines((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleLocationType = (id, value) => {
    setWines((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, locationType: value, country: value === "italy" ? "" : w.country }
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

  // Togli/rimetti da menu → aggiorna solo lo status
  const handleRemoveFromMenu = async (wine, newStatus) => {
    await fetch("/api/wines", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWine({ ...wine, status: newStatus })),
    });
    load();
  };

  // Salva info aggiuntive
  const handleSaveInfo = async (id, info) => {
    const wine = wines.find((w) => w.id === id);
    if (!wine) return;
    await fetch("/api/wines", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWine({ ...wine, info })),
    });
    setInfoWine(null);
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
    load();
  };

  const WineRow = ({ w, isEditing }) => {
    const dis = !isEditing;
    return (
      <div className={`table-row excel ${isEditing ? "editing" : "view-mode"}`}>
        <input placeholder="Nome vino" value={w.name} disabled={dis}
          onChange={(e) => handleChange(w.id, "name", e.target.value)} />
        <input placeholder="Cantina" value={w.cellar} disabled={dis}
          onChange={(e) => handleChange(w.id, "cellar", e.target.value)} />
        <input type="number" placeholder="Anno" value={w.year} disabled={dis}
          onChange={(e) => handleChange(w.id, "year", e.target.value)} />
        <select value={w.type} disabled={dis}
          onChange={(e) => handleChange(w.id, "type", e.target.value)}>
          <option value="">Tipo</option>
          <option value="bianco">Bianco</option>
          <option value="rosso">Rosso</option>
          <option value="rosato">Rosato</option>
        </select>
        <select value={w.status} disabled={dis}
          onChange={(e) => handleChange(w.id, "status", e.target.value)}>
          <option value="available">Disponibile</option>
          <option value="soldout">Terminato</option>
          <option value="ordered">Ordinato</option>
          <option value="trial">In prova</option>
        </select>
        <input type="number" placeholder="€ acquisto" value={w.purchasePrice} disabled={dis}
          onChange={(e) => handleChange(w.id, "purchasePrice", e.target.value)} />
        <input type="number" placeholder="€ vendita" value={w.sellPrice} disabled={dis}
          onChange={(e) => handleChange(w.id, "sellPrice", e.target.value)} />
        <select value={w.locationType} disabled={dis}
          onChange={(e) => handleLocationType(w.id, e.target.value)}>
          <option value="italy">🇮🇹 Italia</option>
          <option value="foreign">🌍 Estero</option>
        </select>
        <input placeholder={w.locationType === "foreign" ? "Paese..." : "Italia"}
          value={w.country} disabled={dis || w.locationType === "italy"}
          onChange={(e) => handleChange(w.id, "country", e.target.value)} />
        <input placeholder="Regione" value={w.region} disabled={dis}
          onChange={(e) => handleChange(w.id, "region", e.target.value)} />

        <div className="cell-actions">
          {isEditing ? (
            <button className="btn btn-save" onClick={() => saveWine(w)}>💾</button>
          ) : (
            <button className="btn btn-edit" onClick={() => setEditingId(w.id)}>✏️</button>
          )}

          {/* ⋮ KEBAB */}
          <KebabMenu
            wine={w}
            onRemoveFromMenu={handleRemoveFromMenu}
            onOpenInfo={setInfoWine}
          />
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
            <span>Nome</span><span>Cantina</span><span>Anno</span>
            <span>Tipo</span><span>Stato</span><span>Acquisto</span>
            <span>Vendita</span><span>Loc.</span><span>Paese</span>
            <span>Regione</span><span></span>
          </div>

          {wines.map((w) => (
            <WineRow key={w.id} w={w} isEditing={editingId === w.id} />
          ))}

          {/* ── Riga aggiungi ── */}
          <div className="table-row excel add-row">
            <input placeholder="+ Nome vino" value={newWine.name}
              onChange={(e) => setNewWine({ ...newWine, name: e.target.value })} />
            <input placeholder="Cantina" value={newWine.cellar}
              onChange={(e) => setNewWine({ ...newWine, cellar: e.target.value })} />
            <input type="number" placeholder="Anno" value={newWine.year}
              onChange={(e) => setNewWine({ ...newWine, year: e.target.value })} />
            <select value={newWine.type}
              onChange={(e) => setNewWine({ ...newWine, type: e.target.value })}>
              <option value="">Tipo</option>
              <option value="bianco">Bianco</option>
              <option value="rosso">Rosso</option>
              <option value="rosato">Rosato</option>
            </select>
            <select value={newWine.status}
              onChange={(e) => setNewWine({ ...newWine, status: e.target.value })}>
              <option value="available">Disponibile</option>
              <option value="soldout">Terminato</option>
              <option value="ordered">Ordinato</option>
              <option value="trial">In prova</option>
            </select>
            <input type="number" placeholder="€ acquisto" value={newWine.purchasePrice}
              onChange={(e) => setNewWine({ ...newWine, purchasePrice: e.target.value })} />
            <input type="number" placeholder="€ vendita" value={newWine.sellPrice}
              onChange={(e) => setNewWine({ ...newWine, sellPrice: e.target.value })} />
            <select value={newWine.locationType}
              onChange={(e) => setNewWine({
                ...newWine, locationType: e.target.value,
                country: e.target.value === "italy" ? "" : newWine.country,
              })}>
              <option value="italy">🇮🇹 Italia</option>
              <option value="foreign">🌍 Estero</option>
            </select>
            <input placeholder={newWine.locationType === "foreign" ? "Paese..." : "Italia"}
              value={newWine.country} disabled={newWine.locationType === "italy"}
              onChange={(e) => setNewWine({ ...newWine, country: e.target.value })} />
            <input placeholder="Regione" value={newWine.region}
              onChange={(e) => setNewWine({ ...newWine, region: e.target.value })} />
            <div className="cell-actions">
              <button className="btn btn-add" onClick={addWine}>＋</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal info aggiuntive ── */}
      {infoWine && (
        <InfoModal
          wine={infoWine}
          onClose={() => setInfoWine(null)}
          onSave={handleSaveInfo}
        />
      )}
    </div>
  );
}