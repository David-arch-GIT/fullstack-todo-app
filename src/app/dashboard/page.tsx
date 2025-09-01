'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import AddTodoForm, { type AddTodoPayload } from '@/components/todo/add-todo-form';
import { FiltersBar } from '@/components/todo/filters-bar';
import TodoItem from '@/components/todo/todo-item';
import BulkActions from '@/components/todo/bulk-actions';
import { useUser } from '@/hooks/use-user';
import { useTodos, type Filters } from '@/hooks/use-todos';
import { toast } from 'sonner';

type Priority = 'low' | 'medium' | 'high';

export default function DashboardPage() {
  const router = useRouter();
  const { userId, loading } = useUser();

  const {
    todos, categories, counts, loading: loadingTodos,
    refresh, refreshCategories, add, update, toggleCompleted, remove,
    bulkSetCompleted, bulkSetPriority, bulkDelete,
  } = useTodos(userId);

  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    priority: 'all',
    categoryId: 'all',
    q: '',
  });

  useEffect(() => {
    if (!loading && !userId) router.replace('/login?redirect=/dashboard');
  }, [loading, userId, router]);

  useEffect(() => {
    if (!userId) return;
    void refresh(filters);
  }, [filters, userId, refresh]);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([id]) => id),
    [selected]
  );
  const clearSelection = () => setSelected({});

  if (loading || !userId) {
    return <div className="container py-10">Cargando…</div>;
  }

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <Card>
        <CardContent className="pt-6 overflow-visible">
          <FiltersBar
            filters={filters}
            onChange={(f) => setFilters((s) => ({ ...s, ...f }))}
            categories={categories}
            counts={counts}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 overflow-visible">
          <AddTodoForm
            categories={categories}
            onCreate={async (payload: AddTodoPayload) => {
              try {
                await add(payload);
                await Promise.all([refresh(filters), refreshCategories()]);
                toast.success('Tarea creada');
              } catch (e: unknown) {
                toast.error('No se pudo crear', { description: (e as Error).message });
              }
            }}
          />
        </CardContent>
      </Card>

      <BulkActions
        selectedIds={selectedIds}
        clear={clearSelection}
        onSetCompleted={async (v: boolean) => {
          try {
            await bulkSetCompleted(selectedIds, v);
            clearSelection();
            await refresh(filters);
            toast.success(v ? 'Tareas completadas' : 'Tareas activadas');
          } catch (e: unknown) {
            toast.error('Operación fallida', { description: (e as Error).message });
          }
        }}
        onSetPriority={async (p: Priority) => {
          try {
            await bulkSetPriority(selectedIds, p);
            clearSelection();
            await refresh(filters);
            toast.success('Prioridad actualizada');
          } catch (e: unknown) {
            toast.error('No se pudo actualizar', { description: (e as Error).message });
          }
        }}
        onDelete={async () => {
          try {
            await bulkDelete(selectedIds);
            clearSelection();
            await refresh(filters);
            toast.success('Tareas eliminadas');
          } catch (e: unknown) {
            toast.error('No se pudieron eliminar', { description: (e as Error).message });
          }
        }}
      />

      <div className="space-y-3">
        {loadingTodos && <div className="text-sm text-muted-foreground">Cargando…</div>}
        {!loadingTodos && todos.length === 0 && (
          <div className="rounded-xl border bg-muted/30 p-6 text-center text-muted-foreground">
            No hay tareas con los filtros actuales.
          </div>
        )}

        {todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            categories={categories}
            selected={Boolean(selected[t.id])}
            onSelectChange={(checked) => setSelected((s) => ({ ...s, [t.id]: checked }))}

            onToggle={async (id, completed) => {
              try {
                await toggleCompleted(id, completed);
                await refresh(filters);
              } catch (e: unknown) {
                toast.error('No se pudo actualizar', { description: (e as Error).message });
              }
            }}

            onUpdate={async (id, patch) => {
              try {
                await update(id, patch);
                await refresh(filters);
                toast.success('Cambios guardados');
              } catch (e: unknown) {
                toast.error('No se pudo guardar', { description: (e as Error).message });
              }
            }}

            onDelete={async (id) => {
              try {
                await remove(id);
                await refresh(filters);
                toast.success('Tarea eliminada');
              } catch (e: unknown) {
                toast.error('No se pudo eliminar', { description: (e as Error).message });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
