"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  return (
    <div className="navbar">

      <div className="nav-left">
        🍷 Wine Manager
      </div>

      <div className="nav-center">
        <Link className={path === "/admin" ? "active" : ""} href="/admin">
          Dashboard
        </Link>

        <Link className={path === "/admin/wines" ? "active" : ""} href="/admin/wine">
          Vini
        </Link>

        <Link href="/menu">
          Menu
        </Link>
      </div>

      <div className="nav-right">
        👤 Admin
      </div>

    </div>
  );
}