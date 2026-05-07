"use client";

import { useEffect, useState } from "react";
import { Wine, Star } from "lucide-react";
import Navbar from "../components/layout/Navbar";

// ─────────────────────────────────────────────────────────────
// COSTANTI
// ─────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  bianco: "Bianchi",
  rosso: "Rossi",
  rosato: "Rosati",
  bollicina: "Bollicine",
  dolce: "Dolci",
};

const TYPE_EMOJIS = {
  bianco: "🥂",
  rosso: "🍷",
  rosato: "🌸",
  bollicina: "✨",
  dolce: "🍯",
};

const TYPE_ORDER = [
  "bollicina",
  "bianco",
  "rosato",
  "rosso",
  "dolce",
];

// ─────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────

function MenuHeader() {
  return (
    <header className="menu-header-elegant">
      <div className="menu-header-icon">
        <Wine size={28} />
      </div>

      <h1 className="menu-title-elegant">
        Carta dei Vini
      </h1>

      <div className="menu-subtitle-row">
        <span className="menu-divider-line" />

        <p className="menu-subtitle-text">
          Selezione curata
        </p>

        <span className="menu-divider-line" />
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────────

function MenuWineCard({ wine }) {
  const info = wine.info || {};

  return (
    <div className="menu-card-elegant">
      <div className="menu-card-main">

        {/* LEFT */}
        <div className="menu-card-left">

          <div className="wine-name-row">
            {wine.featured && (
              <Star
                size={13}
                className="wine-star"
              />
            )}

            <h3 className="wine-name-elegant">
              {wine.name}
            </h3>
          </div>

          <div className="wine-meta-row">

            {wine.cellar && (
              <span>{wine.cellar}</span>
            )}

            {wine.region && (
              <span>
                · {wine.region}
              </span>
            )}

            {wine.country &&
              !wine.region && (
                <span>
                  · {wine.country}
                </span>
              )}

            {wine.year && (
              <span>
                · {wine.year}
              </span>
            )}

          </div>

          {info.grapes && (
            <p className="wine-grapes">
              {info.grapes}

              {info.servingTemp
                ? ` · ${info.servingTemp}`
                : ""}
            </p>
          )}

          {info.notes && (
            <p className="wine-notes">
              {info.notes}
            </p>
          )}

          {info.pairings && (
            <p className="wine-pairings">
              🍽 {info.pairings}
            </p>
          )}

        </div>

        {/* RIGHT */}
        <div className="menu-card-right">
          <p className="wine-price-elegant">
            € {wine.sellPrice}
          </p>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SEZIONE
// ─────────────────────────────────────────────────────────────

function MenuTypeSection({
  type,
  wines,
}) {
  if (!wines.length) return null;

  return (
    <section className="menu-section-elegant">

      <div className="menu-section-header">

        <span className="menu-section-emoji">
          {TYPE_EMOJIS[type] || "🍷"}
        </span>

        <h2 className="menu-section-title-elegant">
          {TYPE_LABELS[type] || type}
        </h2>

        <span className="menu-section-count">
          {wines.length}{" "}
          {wines.length === 1
            ? "etichetta"
            : "etichette"}
        </span>

      </div>

      <div>
        {wines.map((w) => (
          <MenuWineCard
            key={w.id}
            wine={w}
          />
        ))}
      </div>

    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGINA
// ─────────────────────────────────────────────────────────────

export default function MenuPage() {

  const [wines, setWines] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // FILTRI
  const [filter, setFilter] =
    useState("tutti");

  const [
    originFilter,
    setOriginFilter,
  ] = useState("TUTTI");

  const [
    countryFilter,
    setCountryFilter,
  ] = useState("TUTTI");

  const [
    regionFilter,
    setRegionFilter,
  ] = useState("TUTTI");

  // ───────────────────────────────────────────────────────────
  // LOAD
  // ───────────────────────────────────────────────────────────

  useEffect(() => {

    (async () => {

      try {

        setLoading(true);

        const res =
          await fetch("/api/wines");

        if (!res.ok) {
          throw new Error(
            "Errore caricamento vini"
          );
        }

        const data =
          await res.json();

        const normalized = (
          Array.isArray(data)
            ? data
            : []
        ).map((w) => ({
          ...w,

          // TYPE RESTA LOWERCASE
          type:
            w.type?.trim() || "",

          // NORMALIZZA
          country:
            w.country
              ?.trim()
              .toUpperCase() || "",

          region:
            w.region
              ?.trim()
              .toUpperCase() || "",
        }));

        setWines(normalized);

      } catch (err) {

        setError(
          err.message ||
            "Errore sconosciuto"
        );

      } finally {

        setLoading(false);

      }

    })();

  }, []);

  // ───────────────────────────────────────────────────────────
  // DISPONIBILI
  // ───────────────────────────────────────────────────────────

  const availableWines =
    wines.filter(
      (w) =>
        w.status === "available"
    );

  // ───────────────────────────────────────────────────────────
  // FILTRO TIPO
  // ───────────────────────────────────────────────────────────

  const typeFiltered =
    filter === "tutti"
      ? availableWines
      : availableWines.filter(
          (w) =>
            w.type === filter
        );

  // ───────────────────────────────────────────────────────────
  // FILTRO ORIGINE
  // ───────────────────────────────────────────────────────────

  const originFiltered =
    typeFiltered.filter((w) => {

      if (
        originFilter === "TUTTI"
      ) {
        return true;
      }

      if (
        originFilter === "ITALIA"
      ) {
        return (
          w.locationType ===
          "italy"
        );
      }

      if (
        originFilter === "ESTERO"
      ) {
        return (
          w.locationType ===
          "foreign"
        );
      }

      return true;
    });

  // ───────────────────────────────────────────────────────────
  // COUNTRIES
  // ───────────────────────────────────────────────────────────

  const countries = [
    ...new Set(
      originFiltered
        .filter(
          (w) =>
            w.locationType ===
            "foreign"
        )
        .map((w) => w.country)
        .filter(Boolean)
    ),
  ];

  // ───────────────────────────────────────────────────────────
  // REGIONS
  // ───────────────────────────────────────────────────────────

  const regions = [
    ...new Set(
      originFiltered
        .filter((w) => {

          if (
            originFilter ===
            "ITALIA"
          ) {
            return (
              w.locationType ===
              "italy"
            );
          }

          if (
            originFilter ===
            "ESTERO"
          ) {
            return (
              countryFilter ===
                "TUTTI" ||
              w.country ===
                countryFilter
            );
          }

          return true;

        })
        .map((w) => w.region)
        .filter(Boolean)
    ),
  ];

  // ───────────────────────────────────────────────────────────
  // FILTRO FINALE
  // ───────────────────────────────────────────────────────────

  const finalFiltered =
    originFiltered.filter((w) => {

      // COUNTRY
      if (
        originFilter ===
          "ESTERO" &&
        countryFilter !==
          "TUTTI" &&
        w.country !==
          countryFilter
      ) {
        return false;
      }

      // REGION
      if (
        regionFilter !==
          "TUTTI" &&
        w.region !==
          regionFilter
      ) {
        return false;
      }

      return true;

    });

  // ───────────────────────────────────────────────────────────
  // TYPES
  // ───────────────────────────────────────────────────────────

  const types =
    TYPE_ORDER.filter((t) =>
      finalFiltered.some(
        (w) => w.type === t
      )
    );

  // ───────────────────────────────────────────────────────────
  // GROUP
  // ───────────────────────────────────────────────────────────

  const grouped =
    filter === "tutti"
      ? types.map((t) => ({
          type: t,
          wines:
            finalFiltered.filter(
              (w) =>
                w.type === t
            ),
        }))
      : [
          {
            type: filter,
            wines:
              finalFiltered.filter(
                (w) =>
                  w.type === filter
              ),
          },
        ];

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────

  return (
    <div>

      <Navbar />

      <div className="menu-page-elegant">

        <MenuHeader />

        {/* FILTRI TIPO */}
        {!loading &&
          availableWines.length >
            0 && (
            <>

              <div className="menu-filters-elegant">

                <button
                  className={`filter-btn-elegant ${
                    filter === "tutti"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setFilter("tutti")
                  }
                >
                  Tutti
                </button>

                {TYPE_ORDER.map((t) => (
                  <button
                    key={t}
                    className={`filter-btn-elegant ${
                      filter === t
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setFilter(t)
                    }
                  >
                    {TYPE_EMOJIS[t]}{" "}
                    {TYPE_LABELS[t]}
                  </button>
                ))}

              </div>

              {/* ORIGINE */}
              <div className="menu-filters-elegant secondary">

                <button
                  className={`filter-btn-elegant ${
                    originFilter ===
                    "TUTTI"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setOriginFilter(
                      "TUTTI"
                    );

                    setCountryFilter(
                      "TUTTI"
                    );

                    setRegionFilter(
                      "TUTTI"
                    );
                  }}
                >
                  🌍 Tutto
                </button>

                <button
                  className={`filter-btn-elegant ${
                    originFilter ===
                    "ITALIA"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setOriginFilter(
                      "ITALIA"
                    );

                    setCountryFilter(
                      "TUTTI"
                    );

                    setRegionFilter(
                      "TUTTI"
                    );
                  }}
                >
                  🇮🇹 Italia
                </button>

                <button
                  className={`filter-btn-elegant ${
                    originFilter ===
                    "ESTERO"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setOriginFilter(
                      "ESTERO"
                    );

                    setCountryFilter(
                      "TUTTI"
                    );

                    setRegionFilter(
                      "TUTTI"
                    );
                  }}
                >
                  🌍 Estero
                </button>

              </div>

              {/* PAESE */}
              {originFilter ===
                "ESTERO" &&
                countries.length >
                  0 && (
                <div className="menu-filters-elegant secondary">

                  <button
                    className={`filter-btn-elegant ${
                      countryFilter ===
                      "TUTTI"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setCountryFilter(
                        "TUTTI"
                      );

                      setRegionFilter(
                        "TUTTI"
                      );
                    }}
                  >
                    Tutti i paesi
                  </button>

                  {countries.map((c) => (
                    <button
                      key={c}
                      className={`filter-btn-elegant ${
                        countryFilter === c
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setCountryFilter(c);

                        setRegionFilter(
                          "TUTTI"
                        );
                      }}
                    >
                      {c}
                    </button>
                  ))}

                </div>
              )}

              {/* REGIONE */}
              {regions.length > 0 && (
                <div className="menu-filters-elegant secondary">

                  <button
                    className={`filter-btn-elegant ${
                      regionFilter ===
                      "TUTTI"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setRegionFilter(
                        "TUTTI"
                      )
                    }
                  >
                    Tutte le regioni
                  </button>

                  {regions.map((r) => (
                    <button
                      key={r}
                      className={`filter-btn-elegant ${
                        regionFilter === r
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setRegionFilter(r)
                      }
                    >
                      {r}
                    </button>
                  ))}

                </div>
              )}

            </>
          )}

        {/* STATI */}
        {loading && (
          <p className="status-msg">
            Caricamento carta…
          </p>
        )}

        {error && (
          <p className="status-msg error">
            {error}
          </p>
        )}

        {!loading &&
          availableWines.length ===
            0 && (
            <p className="menu-empty">
              Nessun vino disponibile.
            </p>
          )}

        {/* SEZIONI */}
        {!loading && (
          <div className="menu-sections-wrapper">

            {grouped.map(
              ({
                type,
                wines: group,
              }) => (
                <MenuTypeSection
                  key={type}
                  type={type}
                  wines={group}
                />
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}