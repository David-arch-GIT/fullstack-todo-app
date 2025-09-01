// src/lib/supabase/client.ts
'use client';

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Devuelve un cliente de Supabase (singleton en el navegador).
 * Se usa en componentes cliente (use client).
 */
export function createClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      'Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  _client = createSupabaseClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}

/** Conveniencia: singleton ya inicializado */
export const supabase: SupabaseClient = createClient();

// (Opcional) compat por si en algún sitio usas default import.
// export default supabase;
