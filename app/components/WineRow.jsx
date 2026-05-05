"use client";

export default function WineRow({
  w,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onChange,
  onLocationType,
}) {
  const dis = !isEditing;

  return (
    <div className={`table-row excel ${isEditing ? "editing" : "view-mode"}`}>
      <input
        placeholder="Nome vino"
        value={w.name}
        disabled={dis}
        onChange={(e) => onChange(w.id, "name", e.target.value)}
      />
      <input
        placeholder="Cantina"
        value={w.cellar}
        disabled={dis}
        onChange={(e) => onChange(w.id, "cellar", e.target.value)}
      />
      <input
        type="number"
        placeholder="Anno"
        value={w.year}
        disabled={dis}
        onChange={(e) => onChange(w.id, "year", e.target.value)}
      />
      <select
        value={w.type}
        disabled={dis}
        onChange={(e) => onChange(w.id, "type", e.target.value)}
      >
        <option value="">Tipo</option>
        <option value="bianco">Bianco</option>
        <option value="rosso">Rosso</option>
        <option value="rosato">Rosato</option>
        <option value="bollicine">Bollicine</option>
        <option value="dolce">Dolce</option>
      </select>
      <select
        value={w.status}
        disabled={dis}
        onChange={(e) => onChange(w.id, "status", e.target.value)}
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
        onChange={(e) => onChange(w.id, "purchasePrice", e.target.value)}
      />
      <input
        type="number"
        placeholder="€ vendita"
        value={w.sellPrice}
        disabled={dis}
        onChange={(e) => onChange(w.id, "sellPrice", e.target.value)}
      />
      <select
        value={w.locationType}
        disabled={dis}
        onChange={(e) => onLocationType(w.id, e.target.value)}
      >
        <option value="italy">🇮🇹 Italia</option>
        <option value="foreign">🌍 Estero</option>
      </select>
      <input
        placeholder={w.locationType === "foreign" ? "Paese..." : "Italia"}
        value={w.country}
        disabled={dis || w.locationType === "italy"}
        onChange={(e) => onChange(w.id, "country", e.target.value)}
      />
      <input
        placeholder="Regione"
        value={w.region}
        disabled={dis}
        onChange={(e) => onChange(w.id, "region", e.target.value)}
      />
      <div className="cell-actions">
        {isEditing ? (
          <>
            <button className="btn btn-save" onClick={() => onSave(w)} title="Salva">
              💾
            </button>
            <button className="btn btn-delete" onClick={() => onDelete(w.id)} title="Elimina">
              🗑️
            </button>
          </>
        ) : (
          <button className="btn btn-edit" onClick={() => onEdit(w.id)} title="Modifica">
            ✏️
          </button>
        )}
      </div>
    </div>
  );
}