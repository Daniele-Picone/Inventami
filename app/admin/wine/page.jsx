"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import WineRow from "../../components/WineRow";

// ─────────────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────────────

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
  grapes: "",
  notes: "",
  servingTemp: "",
  pairings: "",
  organic: false,
};

const buildWine = (wine) => ({
  id: wine.id || Date.now(),
  name: wine.name || "",
  cellar: wine.cellar || "",
  year: wine.year ? Number(wine.year) : "",
  type: wine.type || "",
  status: wine.status || "available",
  purchasePrice: wine.purchasePrice
    ? Number(wine.purchasePrice)
    : 0,
  sellPrice: wine.sellPrice
    ? Number(wine.sellPrice)
    : 0,
  locationType: wine.locationType || "italy",
  country: wine.country || "",
  region: wine.region || "",
  info: wine.info || EMPTY_INFO,
});

// ─────────────────────────────────────────────────────────────
// KEBAB MENU
// ─────────────────────────────────────────────────────────────

function KebabMenu({
  wine,
  onRemoveFromMenu,
  onOpenInfo,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  const isOffMenu = wine.status === "soldout";

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
    >
      <button
        className="btn btn-kebab"
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>

      {open && (
        <div className="kebab-dropdown">
          <button
            className="kebab-item"
            onClick={() => {
              onRemoveFromMenu(
                wine,
                isOffMenu
                  ? "available"
                  : "soldout"
              );
              setOpen(false);
            }}
          >
            {isOffMenu
              ? "✅ Rimetti in menu"
              : "🚫 Togli da menu"}
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

// ─────────────────────────────────────────────────────────────
// INFO MODAL
// ─────────────────────────────────────────────────────────────

function InfoModal({
  wine,
  onClose,
  onSave,
}) {
  const [info, setInfo] = useState(
    wine.info || EMPTY_INFO
  );

  const field = (
    key,
    label,
    placeholder,
    type = "text"
  ) => (
    <div className="info-field">
      <label>{label}</label>

      {key === "notes" ||
      key === "pairings" ? (
        <textarea
          rows={3}
          value={info[key]}
          placeholder={placeholder}
          onChange={(e) =>
            setInfo({
              ...info,
              [key]: e.target.value,
            })
          }
        />
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          checked={info[key]}
          onChange={(e) =>
            setInfo({
              ...info,
              [key]: e.target.checked,
            })
          }
        />
      ) : (
        <input
          type={type}
          value={info[key]}
          placeholder={placeholder}
          onChange={(e) =>
            setInfo({
              ...info,
              [key]: e.target.value,
            })
          }
        />
      )}
    </div>
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <h2>📝 {wine.name}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {field(
            "grapes",
            "Uvaggi",
            "es. Sangiovese 85%"
          )}

          {field(
            "servingTemp",
            "Temperatura servizio",
            "es. 16-18°C"
          )}

          {field(
            "pairings",
            "Abbinamenti",
            "es. carne rossa"
          )}

          {field(
            "notes",
            "Note",
            "Descrizione..."
          )}

          <div className="info-field">
            <label>
              🌿 Biologico / Naturale
            </label>

            <input
              type="checkbox"
              checked={info.organic}
              onChange={(e) =>
                setInfo({
                  ...info,
                  organic:
                    e.target.checked,
                })
              }
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-save"
            onClick={() =>
              onSave(wine.id, info)
            }
          >
            💾 Salva
          </button>

          <button
            className="btn btn-cancel"
            onClick={onClose}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function WinesAdmin() {
  const [wines, setWines] = useState([]);
  const [editingId, setEditingId] =
    useState(null);

  const [newWine, setNewWine] =
    useState(EMPTY_WINE);

  const [infoWine, setInfoWine] =
    useState(null);

  // LOAD
  const load = async () => {
    const res = await fetch("/api/wines");
    const data = await res.json();

    setWines(data.map(buildWine));
  };

  useEffect(() => {
    load();
  }, []);

  // CHANGE
  const handleChange = (
    id,
    field,
    value
  ) => {
    setWines((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              [field]: value,
            }
          : w
      )
    );
  };

  // LOCATION
  const handleLocationType = (
    id,
    value
  ) => {
    setWines((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              locationType: value,
              country:
                value === "italy"
                  ? ""
                  : w.country,
            }
          : w
      )
    );
  };

  // SAVE
  const saveWine = async (wine) => {
    await fetch("/api/wines", {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        buildWine(wine)
      ),
    });

    setEditingId(null);

    load();
  };

  // DELETE
  const deleteWine = async (id) => {
    await fetch("/api/wines", {
      method: "DELETE",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ id }),
    });

    load();
  };

  // ADD
  const addWine = async () => {
    if (!newWine.name) return;

    await fetch("/api/wines", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        buildWine(newWine)
      ),
    });

    setNewWine(EMPTY_WINE);

    load();
  };

  // REMOVE FROM MENU
  const handleRemoveFromMenu =
    async (wine, newStatus) => {
      await fetch("/api/wines", {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          buildWine({
            ...wine,
            status: newStatus,
          })
        ),
      });

      load();
    };

  // SAVE INFO
  const handleSaveInfo = async (
    id,
    info
  ) => {
    const wine = wines.find(
      (w) => w.id === id
    );

    if (!wine) return;

    await fetch("/api/wines", {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        buildWine({
          ...wine,
          info,
        })
      ),
    });

    setInfoWine(null);

    load();
  };

  return (
    <div>
      <Navbar />

      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">
            🍷 Gestione Vini
          </h1>
        </div>

        <div className="table-scroll">
          {/* HEADER */}
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

          {/* ROWS */}
          {wines.map((w) => (
            <div
              key={w.id}
              className="wine-row-wrapper"
            >
              <WineRow
                w={w}
                isEditing={
                  editingId === w.id
                }
                onEdit={setEditingId}
                onSave={saveWine}
                onDelete={deleteWine}
                onChange={handleChange}
                onLocationType={
                  handleLocationType
                }
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  marginBottom: 12,
                }}
              >
                <KebabMenu
                  wine={w}
                  onRemoveFromMenu={
                    handleRemoveFromMenu
                  }
                  onOpenInfo={
                    setInfoWine
                  }
                />
              </div>
            </div>
          ))}

          {/* ADD ROW */}
          <div className="table-row excel add-row">
            <input
              placeholder="+ Nome vino"
              value={newWine.name}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  name:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Cantina"
              value={newWine.cellar}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  cellar:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Anno"
              value={newWine.year}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  year:
                    e.target.value,
                })
              }
            />

            <select
              value={newWine.type}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  type:
                    e.target.value,
                })
              }
            >
             

              <option value="bianco">
                Bianco
              </option>

              <option value="rosso">
                Rosso
              </option>

              <option value="rosato">
                Rosato
              </option>

              <option value="bollicina">
                Bollicina
              </option>

              <option value="dolce">
                Dolce
              </option>
            </select>

            <select
              value={newWine.status}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  status:
                    e.target.value,
                })
              }
            >
              <option value="available">
                Disponibile
              </option>

              <option value="soldout">
                Terminato
              </option>

              <option value="ordered">
                Ordinato
              </option>

              <option value="trial">
                In prova
              </option>
            </select>

            <input
              type="number"
              placeholder="€ acquisto"
              value={
                newWine.purchasePrice
              }
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  purchasePrice:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="€ vendita"
              value={newWine.sellPrice}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  sellPrice:
                    e.target.value,
                })
              }
            />

            <select
              value={
                newWine.locationType
              }
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  locationType:
                    e.target.value,
                })
              }
            >
              <option value="italy">
                🇮🇹 Italia
              </option>

              <option value="foreign">
                🌍 Estero
              </option>
            </select>

            <input
              placeholder="Paese"
              value={newWine.country}
              disabled={
                newWine.locationType ===
                "italy"
              }
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  country:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Regione"
              value={newWine.region}
              onChange={(e) =>
                setNewWine({
                  ...newWine,
                  region:
                    e.target.value,
                })
              }
            />

            <div className="cell-actions">
              <button
                className="btn btn-add"
                onClick={addWine}
              >
                ＋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {infoWine && (
        <InfoModal
          wine={infoWine}
          onClose={() =>
            setInfoWine(null)
          }
          onSave={handleSaveInfo}
        />
      )}
    </div>
  );
}