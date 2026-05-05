"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="portal">
      <div className="portal-hero">
        <div className="portal-icon-ring">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M18 4C14 4 10 8 10 14c0 4.5 2.5 8 6 9.5V30h-3v2h10v-2h-3v-6.5C23.5 22 26 18.5 26 14c0-6-4-10-8-10z"
              fill="var(--wine)"
              opacity="0.9"
            />
            <ellipse cx="18" cy="13" rx="5" ry="2.5" fill="var(--cream)" opacity="0.2" />
          </svg>
        </div>
        <h1>Wine Manager</h1>
        <div className="portal-subtitle-row">
          <span className="portal-divider-line" />
          <p className="portal-subtitle-text">Gestione magazzino ristorante</p>
          <span className="portal-divider-line" />
        </div>
      </div>

      <div className="portal-grid">
        <div className="portal-card">
          <div className="portal-card-icon guest">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                fill="var(--wine)"
              />
            </svg>
          </div>
          <h2>Ospite</h2>
          <p>Consulta la carta vini</p>
          <button className="btn btn-primary" onClick={() => router.push("/menu")}>
            Sfoglia la carta →
          </button>
        </div>

        <div className="portal-card">
          <div className="portal-card-icon admin">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h2>Admin</h2>
          <p>Gestione magazzino</p>
          <button className="btn btn-secondary" onClick={() => router.push("/login")}>
            Accedi
          </button>
        </div>
      </div>

      <p className="portal-footer">© {new Date().getFullYear()} — Sistema interno</p>
    </main>
  );
}