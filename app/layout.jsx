import "./globals.css";
import { AuthProvider } from "../lib/useAuth";
 
export const metadata = {
  title: "Inventami — Wine Manager",
  description: "Gestionale vini per ristorante",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
 