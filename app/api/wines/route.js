let wines = [
  { id: 1, name: "Chianti Classico", price: 18, quantity: 10 },
  { id: 2, name: "Brunello", price: 45, quantity: 0 },
];

export async function GET() {
  return Response.json(wines);
}

export async function POST(req) {
  const body = await req.json();

  wines.push({
    id: Date.now(),
    ...body,
  });

  return Response.json({ success: true });
}