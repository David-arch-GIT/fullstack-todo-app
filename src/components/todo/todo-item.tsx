// src/components/todo/todo-item.tsx
'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Flag,
  Tag,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Todo = {
  id: string;
  title: string;
  description?: string | null;
  due_date?: string | null;       // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  category_id?: string | null;
  completed: boolean;
};

type Props = {
  todo: Todo;
  categories: { id: string; name: string }[];
  selected: boolean;
  onSelectChange: (checked: boolean) => void;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, patch: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

/** Paleta por prioridad (colores ya OK) */
const PRIORITY_THEME = {
  high: {
    ribbon: 'before:bg-rose-500',
    badge: 'bg-rose-500/15 text-rose-600 ring-rose-500/20',
    dot: 'text-rose-500',
  },
  medium: {
    ribbon: 'before:bg-amber-500',
    badge: 'bg-amber-500/15 text-amber-700 ring-amber-500/20',
    dot: 'text-amber-500',
  },
  low: {
    ribbon: 'before:bg-emerald-500',
    badge: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20',
    dot: 'text-emerald-500',
  },
} as const;

export default function TodoItem({
  todo, categories, selected, onSelectChange, onToggle, onUpdate, onDelete,
}: Props) {
  const [saving, setSaving] = useState(false);

  const theme = PRIORITY_THEME[todo.priority];

  const dueInfo = useMemo(() => {
    if (!todo.due_date) return { label: 'Sin fecha', tone: 'text-muted-foreground', badge: 'bg-muted text-muted-foreground' };
    const today = new Date();
    const d = new Date(todo.due_date);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = d.getTime() === t.getTime();
    const overdue = d.getTime() < t.getTime();
    if (overdue) return { label: 'Vencida', tone: 'text-rose-600', badge: 'bg-rose-500/15 text-rose-600' };
    if (isToday) return { label: 'Hoy', tone: 'text-amber-700', badge: 'bg-amber-500/15 text-amber-700' };
    return { label: 'Próxima', tone: 'text-emerald-700', badge: 'bg-emerald-500/15 text-emerald-700' };
  }, [todo.due_date]);

  async function patch(patch: Partial<Todo>) {
    setSaving(true);
    try {
      await onUpdate(todo.id, patch);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-xl border shadow-sm transition-all',
        'bg-gradient-to-br from-background to-muted/30',
        'hover:shadow-md',
        'before:absolute before:left-0 before:top-0 before:h-full before:w-1',
        todo.completed ? 'before:bg-muted' : theme.ribbon
      )}
    >
      <div className="p-4">
        {/* FILA 1 — distribución estable y estética */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Checks */}
          <div className="flex items-center gap-3 order-1">
            <Checkbox
              checked={selected}
              onCheckedChange={(v) => onSelectChange(Boolean(v))}
              aria-label="Seleccionar"
            />
            <button
              type="button"
              aria-label={todo.completed ? 'Marcar como activa' : 'Marcar como completada'}
              onClick={() => onToggle(todo.id, !todo.completed)}
              className={cn(
                'inline-flex size-6 items-center justify-center rounded-full border transition-colors',
                todo.completed ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {todo.completed ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
            </button>
          </div>

          {/* Título (ocupa lo que quede) */}
          <Input
            className="order-2 flex-1 min-w-[220px] bg-background/80 focus-visible:ring-1"
            value={todo.title}
            onChange={(e) => patch({ title: e.target.value })}
            disabled={saving}
          />

          {/* Prioridad (ancho fijo) */}
          <div className="order-3 w-[120px]">
            <div className="hidden md:flex items-center gap-2 mb-1">
              <Flag className={cn('size-3.5', theme.dot)} />
              <Label className="text-xs text-muted-foreground">Prioridad</Label>
            </div>
            <Select
              value={todo.priority}
              onValueChange={(v) => patch({ priority: v as Todo['priority'] })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha (ancho fijo) + badge (no se corta) */}
          <div className="order-4 flex items-center gap-2 w-[160px]">
            <Input
              type="date"
              value={todo.due_date ?? ''}
              onChange={(e) => patch({ due_date: e.target.value || null })}
              disabled={saving}
              className="h-9"
            />
            <Badge className={cn('shrink-0 whitespace-nowrap', dueInfo.badge)}>
              {dueInfo.label}
            </Badge>
          </div>

          {/* Eliminar (a la derecha) */}
          <div className="order-5 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-destructive"
              onClick={() => onDelete(todo.id)}
              disabled={saving}
              aria-label="Eliminar"
              title="Eliminar"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* FILA 2 — categoría + chips */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Categoría (ancho fijo cómodo) */}
          <div className="w-[240px]">
            <div className="hidden md:flex items-center gap-2 mb-1">
              <Tag className="size-3.5 text-muted-foreground" />
              <Label className="text-xs text-muted-foreground">Categoría</Label>
            </div>
            <Select
              value={todo.category_id ?? 'none'}
              onValueChange={(v) => patch({ category_id: v === 'none' ? null : v })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="none">(Sin categoría)</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chips (ocupan el resto) */}
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Badge className={cn('ring-1 ring-inset', theme.badge)}>
              <Flag className="mr-1.5 size-3.5" />
              {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>

            {todo.completed && (
              <Badge className="bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="mr-1.5 size-3.5" />
                Completada
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
