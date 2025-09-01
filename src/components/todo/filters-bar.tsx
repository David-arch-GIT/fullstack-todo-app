'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import type { Filters } from '@/hooks/use-todos';

type Category = { id: string; name: string };
type Counts = { total: number; active: number; completed: number };

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  categories: Category[];
  counts: Counts;
};

export function FiltersBar({ filters, onChange, categories, counts }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {/* Estado */}
      <div className="grid gap-1">
        <Label>Estado</Label>
        <Select
          value={filters.status}
          onValueChange={(v: Filters['status']) => onChange({ status: v })}
        >
          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prioridad */}
      <div className="grid gap-1">
        <Label>Prioridad</Label>
        <Select
          value={filters.priority}
          onValueChange={(v: Filters['priority']) => onChange({ priority: v })}
        >
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div className="grid gap-1">
        <Label>Categoría</Label>
        <Select
          value={filters.categoryId}
          onValueChange={(v: Filters['categoryId']) => onChange({ categoryId: v })}
        >
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Búsqueda */}
      <div className="grid gap-1">
        <Label>Búsqueda</Label>
        <Input
          placeholder="Título o descripción…"
          value={filters.q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ q: e.target.value })
          }
        />
        <div className="mt-1 text-xs text-muted-foreground">
          Total: {counts.total} · Activas: {counts.active} · Completadas: {counts.completed}
        </div>
      </div>
    </div>
  );
}
