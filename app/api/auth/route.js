import { NextResponse } from "next/server";

const USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "ospite", password: "ospite123", role: "guest" },
];

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Dati mancanti" },
        { status: 400 }
      );
    }

    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      role: user.role,
      username: user.username,
    });

    res.cookies.set("role", user.role, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    res.cookies.set("username", user.username, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Errore server", details: err.message },
      { status: 500 }
    );
  }
}