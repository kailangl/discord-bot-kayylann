import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Meu Bot Discord - Gerenciamento Automatizado",
  description: "Um bot de moderação completo para seu servidor Discord",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}