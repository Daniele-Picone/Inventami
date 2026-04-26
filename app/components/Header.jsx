import Link from "next/link";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="container flex header-inner">

        {/* LOGO */}
        <div className="logo">
          <h1>Inventami</h1>
        </div>

        {/* NAV */}
        <nav className="nav">
          <Link href="/Dashboard">Dashboard</Link>
          <Link href="/inventary">Inventari</Link>
        </nav>

        {/* USER */}
        <div className="profile flex">
          <div className="profile-info">
            <p className="username">Username</p>
            <p className="role">Ruolo</p>
          </div>
        </div>

      </div>
    </header>
  );
}