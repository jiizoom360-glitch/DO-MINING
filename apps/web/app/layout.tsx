import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DO-Mining",
  description: "Plateforme LMS spécialisée Mines & Carrières",
  openGraph: {
    title: "DO-Mining",
    description: "Plateforme LMS spécialisée Mines & Carrières",
    siteName: "DO-Mining",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#08AFC1]/20">
        {children}
      </body>
    </html>
  );
}
