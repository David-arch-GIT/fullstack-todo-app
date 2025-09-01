'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Filters } from '@/hooks/use-todos';
import type { Category } from '@/types';

type StatusFilter = Filters['status'];
type PriorityFilter = Filters['priority'];

type Counts = { total: number; active: number; completed: number };

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  categories: Category[];
  counts: Counts;
};

export function FiltersBar({ filters, onChange, categories, counts }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4 md:items-end">
      {/* Estado */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Estado</span>
        <Select
          value={filters.status}
          onValueChange={(v: StatusFilter) => onChange({ status: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prioridad */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Prioridad</span>
        <Select
          value={filters.priority}
          onValueChange={(v: PriorityFilter) => onChange({ priority: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Categoría</span>
        <Select
          value={filters.categoryId}
          onValueChange={(v: string) =>
            onChange({ categoryId: v === 'all' ? 'all' : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">(Todas)</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Búsqueda */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Búsqueda</span>
        <Input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Título o descripción…"
        />
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>Total: <Badge variant="outline">{counts.total}</Badge></span>
          <span>Activas: <Badge variant="outline">{counts.active}</Badge></span>
          <span>Completadas: <Badge variant="outline">{counts.completed}</Badge></span>
        </div>
      </div>
    </div>
  );
}
