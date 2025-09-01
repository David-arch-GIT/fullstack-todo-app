'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';

type Filters = {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  categoryId: 'all' | string;
  q: string;
};

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  categories: { id: string; name: string }[];
  counts?: { total?: number; active?: number; completed?: number } | any;
};

export function FiltersBar({ filters, onChange, categories, counts }: Props) {
  const total = counts?.total ?? 0;
  const active = counts?.active ?? 0;
  const completed = counts?.completed ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="grid gap-1">
        <Label>Estado</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => onChange({ status: v as Filters['status'] })}
        >
          <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1">
        <Label>Prioridad</Label>
        <Select
          value={filters.priority}
          onValueChange={(v) => onChange({ priority: v as Filters['priority'] })}
        >
          <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1">
        <Label>Categoría</Label>
        <Select
          value={filters.categoryId}
          onValueChange={(v) => onChange({ categoryId: v })}
        >
          <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1 lg:col-span-2">
        <Label>Búsqueda</Label>
        <Input
          placeholder="Título o descripción…"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
        />
        <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5">Total: {total}</span>
          <span className="rounded-full bg-muted px-2 py-0.5">Activas: {active}</span>
          <span className="rounded-full bg-muted px-2 py-0.5">Completadas: {completed}</span>
        </div>
      </div>
    </div>
  );
}
