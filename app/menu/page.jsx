"use client";

import { useEffect, useState } from "react";
import { Wine, Star } from "lucide-react";
import Navbar from "../components/layout/Navbar";

// ── Costanti ─────────────────────────────────────────────────────────────────
const TYPE_LABELS = {
  bianco:    "Bianchi",
  rosso:     "Rossi",
  rosato:    "Rosati",
  bollicine: "Bollicine",
  dolce:     "Dolci",
};

const TYPE_EMOJIS = {
  bianco:    "🥂",
  rosso:     "🍷",
  rosato:    "🌸",
  bollicine: "✨",
  dolce:     "🍯",
};

const TYPE_ORDER = ["bollicine", "bianco", "rosato", "rosso", "dolce"];

// ── MenuHeader ────────────────────────────────────────────────────────────────
function MenuHeader() {
  return (
    <header className="menu-header-elegant">
      <div className="menu-header-icon">
        <Wine size={28} />
      </div>
      <h1 className="menu-title-elegant">Carta dei Vini</h1>
      <div className="menu-subtitle-row">
        <span className="menu-divider-line" />
        <p className="menu-subtitle-text">Selezione curata</p>
        <span className="menu-divider-line" />
      </div>
    </header>
  );
}

// ── MenuWineCard ──────────────────────────────────────────────────────────────
function MenuWineCard({ wine }) {
  const info = wine.info || {};

  return (
    <div className="menu-card-elegant">
      <div className="menu-card-main">
        {/* Sinistra */}
        <div className="menu-card-left">
          <div className="wine-name-row">
            {wine.featured && <Star size={13} className="wine-star" />}
            <h3 className="wine-name-elegant">{wine.name}</h3>
          </div>

          <div className="wine-meta-row">
            {wine.cellar  && <span>{wine.cellar}</span>}
            {wine.region  && <span>· {wine.region}</span>}
            {wine.country && !wine.region && <span>· {wine.country}</span>}
            {wine.year    && <span>· {wine.year}</span>}
          </div>

          {/* Info aggiuntive (se presenti) */}
          {info.grapes && (
            <p className="wine-grapes">
              {info.grapes}
              {info.servingTemp ? ` · ${info.servingTemp}` : ""}
            </p>
          )}

          {info.notes && (
            <p className="wine-notes">{info.notes}</p>
          )}

          {info.pairings && (
            <p className="wine-pairings">🍽 {info.pairings}</p>
          )}
        </div>

        {/* Destra — prezzo */}
        <div className="menu-card-right">
          <p className="wine-price-elegant">€ {wine.sellPrice}</p>
        </div>
      </div>
    </div>
  );
}

// ── MenuTypeSection ───────────────────────────────────────────────────────────
function MenuTypeSection({ type, wines }) {
  if (!wines.length) return null;

  return (
    <section className="menu-section-elegant">
      <div className="menu-section-header">
        <span className="menu-section-emoji">{TYPE_EMOJIS[type] || "🍷"}</span>
        <h2 className="menu-section-title-elegant">
          {TYPE_LABELS[type] || type}
        </h2>
        <span className="menu-section-count">
          {wines.length} {wines.length === 1 ? "etichetta" : "etichette"}
        </span>
      </div>

      <div>
        {wines.map((w) => (
          <MenuWineCard key={w.id} wine={w} />
        ))}
      </div>
    </section>
  );
}

// ── MenuPage (principale) ─────────────────────────────────────────────────────
export default function MenuPage() {
  const [wines, setWines]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [filter, setFilter] = useState("tutti");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/wines");
        if (!res.ok) throw new Error("Errore caricamento vini");
        const data = await res.json();
        setWines(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const availableWines = wines.filter((w) => w.status === "available");

  const types = TYPE_ORDER.filter((t) =>
    availableWines.some((w) => w.type === t)
  );

  const grouped =
    filter === "tutti"
      ? types.map((t) => ({ type: t, wines: availableWines.filter((w) => w.type === t) }))
      : [{ type: filter, wines: availableWines.filter((w) => w.type === filter) }];

  return (
    <div>
      <Navbar />

      <div className="menu-page-elegant">
        <MenuHeader />

        {/* Filtri */}
        {!loading && availableWines.length > 0 && (
          <div className="menu-filters-elegant">
            <button
              className={`filter-btn-elegant ${filter === "tutti" ? "active" : ""}`}
              onClick={() => setFilter("tutti")}
            >
              Tutti
            </button>
            {types.map((t) => (
              <button
                key={t}
                className={`filter-btn-elegant ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {TYPE_EMOJIS[t]} {TYPE_LABELS[t] || t}
              </button>
            ))}
          </div>
        )}

        {/* Stati */}
        {loading && <p className="status-msg">Caricamento carta…</p>}
        {error   && <p className="status-msg error">{error}</p>}
        {!loading && availableWines.length === 0 && (
          <p className="menu-empty">Nessun vino disponibile al momento.</p>
        )}

        {/* Sezioni per tipo */}
        {!loading && (
          <div className="menu-sections-wrapper">
            {grouped.map(({ type, wines: group }) => (
              <MenuTypeSection key={type} type={type} wines={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}