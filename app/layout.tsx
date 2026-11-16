import type { Metadata } from "next";
import "./globals.css";
import { ModalProvider } from "@/components/ui/ModalProvider";

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
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}

