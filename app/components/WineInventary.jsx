import WineForm from "./WineForm";
import { useState } from "react";

export default function WineInventory() {
  const [items, setItems] = useState([]);

  const addWine = (wine) => {
    setItems((prev) => [...prev, wine]);
  };

  return (
    <div>

      <WineForm onSave={addWine} />

      <div className="grid mt-20">
        {items.map((w, i) => (
          <div className="card" key={i}>
            <h3>🍷 {w.nome}</h3>
            <p>{w.cantina}</p>
            <p>{w.tipologia} - {w.formato}</p>
            <p>📦 {w.quantita} bottiglie</p>
            <p>💰 €{w.prezzoVendita}</p>

            {w.quantita <= w.sogliaScorte && (
              <p style={{ color: "red" }}>⚠️ Scorte basse</p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}