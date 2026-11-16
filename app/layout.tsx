import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickLaunch Studio Builder",
  description: "Self-service tool untuk panitia event & UMKM bikin landing page pendaftaran dalam hitungan menit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

