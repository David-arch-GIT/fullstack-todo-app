// src/lib/supabase/client.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

type BrowserClient = SupabaseClient;

let _client: BrowserClient | null = null;

/**
 * Devuelve un cliente de Supabase singleton en el navegador.
 */
export function getSupabaseClient(): BrowserClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      'Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  // crea y guarda; el return nunca es null (evita el error de tipos)
  const client = createBrowserClient(url, anon);
  _client = client;
  return client;
}

export const supabase: BrowserClient = getSupabaseClient();
