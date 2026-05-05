"use client";
 
import { useAuth } from "../../../lib/useAuth";
import { useRouter } from "next/navigation";
 
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
 
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => router.push("/")}>
        🍷 <span>Wine Manager</span>
      </div>
 
      <div className="navbar-links">
        {user?.role === "admin" && (
          <>
            <button
              className="nav-link"
              onClick={() => router.push("/admin")}
            >
              Dashboard
            </button>
            <button
              className="nav-link"
              onClick={() => router.push("/admin/wine")}
            >
              Vini
            </button>
             <button
              className="nav-link"
              onClick={() => router.push("/admin/")}
            >
              Users
            </button>
          </>
        )}
      </div>
 
      <div className="navbar-user">
        {user && (
          <>
            <span className="navbar-username">
              {user.role === "admin" ? "🔐" : "👤"} {user.username}
            </span>
            <button className="btn btn-logout" onClick={logout}>
              Esci
            </button>
          </>
        )}
      </div>
    </nav>
  );
}