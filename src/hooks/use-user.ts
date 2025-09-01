'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { userId, loading };
}
