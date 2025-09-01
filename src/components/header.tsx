'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';

export default function Header() {
  const { userId, loading } = useUser();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    // Opcional: window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
            TodoFS
          </span>
        </Link>

        {!loading && (
          <nav className="flex items-center gap-2 text-sm">
            {userId ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={logout}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Crear cuenta</Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
