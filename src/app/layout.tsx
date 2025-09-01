import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo Full-Stack",
  description: "Next.js + Supabase + shadcn/ui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-app">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
                TodoFS
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-foreground">Iniciar sesión</Link>
              <Link href="/signup" className="hover:text-foreground">Crear cuenta</Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="container pb-20 pt-6">{children}</main>
      </body>
    </html>
  );
}
