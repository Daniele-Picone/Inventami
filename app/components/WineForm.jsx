"use client";

import { useState } from "react";
import "./WineForm.css";

export default function WineForm({ onSave }) {
  const [form, setForm] = useState({
    nome: "",
    tipologia: "rosso",
    cantina: "",
    denominazione: "DOC",
    formato: "0.75L",
    quantita: 0,
    sogliaScorte: 0,
    prezzoAcquisto: 0,
    prezzoVendita: 0,
  });

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      quantita: Number(form.quantita),
      sogliaScorte: Number(form.sogliaScorte),
      prezzoAcquisto: Number(form.prezzoAcquisto),
      prezzoVendita: Number(form.prezzoVendita),
      categoria: "wine",
    });

    setForm({
      nome: "",
      tipologia: "rosso",
      cantina: "",
      denominazione: "DOC",
      formato: "0.75L",
      quantita: 0,
      sogliaScorte: 0,
      prezzoAcquisto: 0,
      prezzoVendita: 0,
    });
  };

  return (
    <form onSubmit={submit} className="card">

      <h2>🍷 Nuovo Vino</h2>

      {/* NOME */}
      <div className="field">
        <label>Nome vino</label>
        <input
          value={form.nome}
          onChange={(e) => update("nome", e.target.value)}
        />
      </div>

      {/* TIPOLOGIA */}
      <div className="field">
        <label>Tipologia</label>
        <select
          value={form.tipologia}
          onChange={(e) => update("tipologia", e.target.value)}
        >
          <option value="rosso">Rosso</option>
          <option value="bianco">Bianco</option>
          <option value="rosé">Rosé</option>
          <option value="spumante">Spumante</option>
        </select>
      </div>

      {/* CANTINA */}
      <div className="field">
        <label>Cantina</label>
        <input
          value={form.cantina}
          onChange={(e) => update("cantina", e.target.value)}
        />
      </div>

      {/* DENOMINAZIONE */}
      <div className="field">
        <label>Denominazione</label>
        <select
          value={form.denominazione}
          onChange={(e) => update("denominazione", e.target.value)}
        >
          <option value="IGT">IGT</option>
          <option value="DOC">DOC</option>
          <option value="DOCG">DOCG</option>
        </select>
      </div>

      {/* FORMATO */}
      <div className="field">
        <label>Formato bottiglia</label>
        <select
          value={form.formato}
          onChange={(e) => update("formato", e.target.value)}
        >
          <option value="0.375L">0.375L</option>
          <option value="0.75L">0.75L</option>
          <option value="1.5L">Magnum 1.5L</option>
          <option value="3L">Jeroboam 3L</option>
        </select>
      </div>

      {/* QUANTITÀ */}
      <div className="field">
        <label>Quantità bottiglie</label>
        <input
          type="number"
          value={form.quantita}
          onChange={(e) => update("quantita", e.target.value)}
        />
      </div>

      {/* SOGLIA SCORTE */}
      <div className="field">
        <label>Soglia scorte</label>
        <input
          type="number"
          value={form.sogliaScorte}
          onChange={(e) => update("sogliaScorte", e.target.value)}
        />
      </div>

      {/* PREZZO ACQUISTO */}
      <div className="field">
        <label>Prezzo acquisto (€)</label>
        <input
          type="number"
          value={form.prezzoAcquisto}
          onChange={(e) => update("prezzoAcquisto", e.target.value)}
        />
      </div>

      {/* PREZZO VENDITA */}
      <div className="field">
        <label>Prezzo vendita (€)</label>
        <input
          type="number"
          value={form.prezzoVendita}
          onChange={(e) => update("prezzoVendita", e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        💾 Salva vino
      </button>

    </form>
  );
}