import Navbar from "../components/layout/Navbar";




     

export default function Admin() {
  return (
    <div>

      <Navbar />

      <div className="page-content">

        <div>

      {/* HEADER */}
      <div className="dash-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="subtitle">Controllo magazzino in tempo reale</p>
      </div>

      {/* KPI SECTION */}
      <div className="kpi-grid">

        <div className="kpi-card">
          <p>🍷 Vini totali</p>
          <h2>120</h2>
          <span className="hint">+3 oggi</span>
        </div>

        <div className="kpi-card warn">
          <p>⚠️ Esauriti</p>
          <h2>5</h2>
          <span className="hint">da riassortire</span>
        </div>

        <div className="kpi-card">
          <p>💰 Valore magazzino</p>
          <h2>€ 2.450</h2>
          <span className="hint">stabile</span>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* AZIONI */}
        <div className="panel">
          <h3>⚡ Azioni rapide</h3>

          <button className="btn btn-primary full">
            ➕ Aggiungi vino
          </button>

          <button className="btn btn-secondary full">
            🍷 Gestisci inventario
          </button>
        </div>

        {/* ATTIVITÀ */}
        <div className="panel">
          <h3>🕒 Attività recenti</h3>

          <div className="activity">
            <span>Chianti modificato</span>
            <small>2 min fa</small>
          </div>

          <div className="activity">
            <span>Brunello aggiornato</span>
            <small>20 min fa</small>
          </div>

          <div className="activity">
            <span>Stock esaurito</span>
            <small>1h fa</small>
          </div>

        </div>

      </div>

    </div>
      </div>

    </div>
  );
}
    
 