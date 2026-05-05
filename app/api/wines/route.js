import { cookies } from "next/headers";
 
// Credenziali hardcoded — in produzione usare variabili d'ambiente
const USERS = [
  { username: "admin", password: "admin123", role: "admin" },

];
let wines = [];

export async function GET() {
  return Response.json(wines);
}

export async function POST(req) {
  try {
    const wine = await req.json();

    if (!wine?.name) {
      return Response.json(
        { error: "Nome vino obbligatorio" },
        { status: 400 }
      );
    }

    const newWine = {
      id: Date.now(),
      name: wine.name || "",
      cellar: wine.cellar || "",
      year: wine.year ? Number(wine.year) : "",
      type: wine.type || "",
      status: wine.status || "available",
      purchasePrice: wine.purchasePrice ? Number(wine.purchasePrice) : 0,
      sellPrice: wine.sellPrice ? Number(wine.sellPrice) : 0,
      locationType: wine.locationType || "italy",
      country: wine.country || "",
      region: wine.region || "",
    };

    wines.push(newWine);

    return Response.json(newWine);
  } catch (err) {
    return Response.json(
      { error: "Errore creazione vino" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const updated = await req.json();

    wines = wines.map((w) =>
      w.id === updated.id
        ? {
            ...w,
            ...updated,
            year: updated.year ? Number(updated.year) : "",
            purchasePrice: updated.purchasePrice
              ? Number(updated.purchasePrice)
              : 0,
            sellPrice: updated.sellPrice ? Number(updated.sellPrice) : 0,
          }
        : w
    );

    return Response.json(updated);
  } catch (err) {
    return Response.json(
      { error: "Errore aggiornamento vino" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    wines = wines.filter((w) => w.id !== id);

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: "Errore eliminazione vino" },
      { status: 500 }
    );
  }
}
