let inventari = [
  { id: "1", nome: "🍝 Food", slug: "food" },
  { id: "2", nome: "🥤 Beverage", slug: "beverage" },
  { id: "3", nome: "🍷 Wine", slug: "wine" },
];

export function getInventari() {
  return inventari;
}

export function addInventario(nome) {
  const slug = generaSlug(nome);

  const nuovo = {
    id: Date.now().toString(),
    nome,
    slug,
  };

  inventari.push(nuovo);
  return nuovo;
}

export function updateInventario(id, nome) {
  inventari = inventari.map((inv) =>
    inv.id === id ? { ...inv, nome, slug: generaSlug(nome) } : inv
  );
}

export function deleteInventario(id) {
  inventari = inventari.filter((inv) => inv.id !== id);
}

export function getBySlug(slug) {
  return inventari.find((inv) => inv.slug === slug);
}

function generaSlug(nome) {
  return nome
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}