'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';

export default function Header() {
  const { userId } = useUser();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <header className="container flex h-14 items-center justify-between">
      <Link href="/" className="font-semibold">TodoFS</Link>
      <nav className="flex items-center gap-2">
        {userId ? (
          <Button variant="outline" onClick={logout}>Salir</Button>
        ) : (
          <>
            <Link href="/login" className="text-sm">Iniciar sesión</Link>
            <Button asChild><Link href="/signup">Crear cuenta</Link></Button>
          </>
        )}
      </nav>
    </header>
  );
}
