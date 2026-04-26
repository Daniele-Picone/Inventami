import "./globals.css";
 
export const metadata = {
  title: "Inventario Ristorante",
  description: "Gestione magazzino ingredienti, bevande e vini",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
 
