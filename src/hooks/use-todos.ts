'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Category, Priority, Todo } from '@/types';

export type StatusFilter = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | Priority;

export type Filters = {
  status: StatusFilter;
  priority: PriorityFilter;
  categoryId: 'all' | string;
  q: string; // búsqueda por texto
};

export function useTodos(userId: string | null) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) setCategories(data as Category[]);
  }, []);

  const refresh = useCallback(async (filters?: Partial<Filters>) => {
    if (!userId) return;
    setLoading(true);

    let q = supabase
      .from('todos')
      .select('*, category:categories(*)')
      .order('inserted_at', { ascending: false });

    // Filtros: se aplican si vienen en filters (útil para la primera carga) o si son "actuales".
    // Para simplificar, dejamos que quien llame pase los valores que quiera.
    if (filters?.status === 'active') q = q.eq('completed', false);
    if (filters?.status === 'completed') q = q.eq('completed', true);
    if (filters?.priority && filters.priority !== 'all') q = q.eq('priority', filters.priority);
    if (filters?.categoryId && filters.categoryId !== 'all') q = q.eq('category_id', filters.categoryId);
    if (filters?.q && filters.q.trim().length > 0) {
      const like = `%${filters.q.trim()}%`;
      q = q.or(`title.ilike.${like},description.ilike.${like}`);
    }

    const { data, error } = await q;

    if (!error && data) setTodos(data as unknown as Todo[]);
    setLoading(false);
  }, [userId]);

  const add = useCallback(async (payload: {
    title: string;
    description?: string | null;
    due_date?: string | null;
    priority: Priority;
    categoryName?: string | null;
    category_id?: string | null; // si ya viene elegido
  }) => {
    if (!userId) throw new Error('No hay usuario');

    let categoryId = payload.category_id ?? null;

    // Si llega categoryName, buscamos/creamos (único por user_id + name)
    if (!categoryId && payload.categoryName && payload.categoryName.trim()) {
      const name = payload.categoryName.trim();
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        categoryId = existing.id;
      } else {
        const { data: created, error: catErr } = await supabase
          .from('categories')
          .insert({ user_id: userId, name })
          .select('id')
          .single();
        if (catErr) throw catErr;
        categoryId = created.id;
        await refreshCategories();
      }
    }

    const { error } = await supabase.from('todos').insert({
      user_id: userId,
      title: payload.title,
      description: payload.description ?? null,
      due_date: payload.due_date ?? null,
      priority: payload.priority,
      category_id: categoryId,
    });

    if (error) throw error;
  }, [userId, refreshCategories]);

  const update = useCallback(async (id: string, patch: Partial<Todo>) => {
    const { error } = await supabase
      .from('todos')
      .update({
        title: patch.title,
        description: patch.description ?? null,
        priority: patch.priority,
        due_date: patch.due_date ?? null,
        category_id: patch.category_id ?? null,
      })
      .eq('id', id);

    if (error) throw error;
  }, []);

  const toggleCompleted = useCallback(async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);
    if (error) throw error;
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
  }, []);

  // Bulk ops
  const bulkSetCompleted = useCallback(async (ids: string[], value: boolean) => {
    const { error } = await supabase.from('todos').update({ completed: value }).in('id', ids);
    if (error) throw error;
  }, []);

  const bulkSetPriority = useCallback(async (ids: string[], p: Priority) => {
    const { error } = await supabase.from('todos').update({ priority: p }).in('id', ids);
    if (error) throw error;
  }, []);

  const bulkDelete = useCallback(async (ids: string[]) => {
    const { error } = await supabase.from('todos').delete().in('id', ids);
    if (error) throw error;
  }, []);

  const counts = useMemo(() => {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    return { total, active, completed: total - active };
  }, [todos]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      await Promise.all([refresh({}), refreshCategories()]);
    })();
  }, [userId, refresh, refreshCategories]);

  return {
    todos,
    categories,
    loading,
    counts,
    refresh,
    refreshCategories,
    add,
    update,
    toggleCompleted,
    remove,
    bulkSetCompleted,
    bulkSetPriority,
    bulkDelete,
  };
}
