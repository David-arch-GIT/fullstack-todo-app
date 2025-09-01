'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';

type Category = { id: string; name: string };

export type Filters = {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  categoryId: 'all' | string;
  q: string;
};

type Counts = { total: number; active: number; completed: number };

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  categories: Category[];
  counts: Counts;
};

export function FiltersBar({ filters, onChange, categories, counts }: Props) {
  // Debounce para búsqueda
  const [qLocal, setQLocal] = useState(filters.q ?? '');

  useEffect(() => {
    // si los filtros llegan actualizados (ej, al resetear), reflejar en el input
    setQLocal(filters.q ?? '');
  }, [filters.q]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (qLocal !== filters.q) onChange({ q: qLocal });
    }, 300);
    return () => clearTimeout(id);
  }, [qLocal, filters.q, onChange]);

  const optionsCategories = useMemo(
    () => [{ id: 'all', name: 'Todas' } as Category, ...categories],
    [categories]
  );

  return (
    <div className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr))]">
      {/* Estado */}
      <div className="grid gap-2">
        <Label>Estado</Label>
        <Select
          value={filters.status}
          onValueChange={(v: 'all' | 'active' | 'completed') => onChange({ status: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prioridad */}
      <div className="grid gap-2">
        <Label>Prioridad</Label>
        <Select
          value={filters.priority}
          onValueChange={(v: 'all' | 'low' | 'medium' | 'high') => onChange({ priority: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div className="grid gap-2">
        <Label>Categoría</Label>
        <Select
          value={filters.categoryId}
          onValueChange={(v: string) => onChange({ categoryId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {optionsCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Búsqueda */}
      <div className="grid gap-2">
        <Label>Búsqueda</Label>
        <Input
          placeholder="Título o descripción..."
          value={qLocal}
          onChange={(e) => setQLocal(e.target.value)}
        />
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Total: {counts.total}</span>
          <span>Activas: {counts.active}</span>
          <span>Completadas: {counts.completed}</span>
        </div>
      </div>
    </div>
  );
}
