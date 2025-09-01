'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-sm">TodoFS</span>
        </Link>

        {/* Enlaces con separación visual */}
        <nav className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Crear cuenta</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
