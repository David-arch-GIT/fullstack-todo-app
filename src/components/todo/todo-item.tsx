'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

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

const PRIORITY_META = {
  low:    { label: 'Baja',   dot: 'bg-emerald-500' },
  medium: { label: 'Media',  dot: 'bg-amber-500' },
  high:   { label: 'Alta',   dot: 'bg-rose-500' },
} as const;

export default function TodoItem({
  todo, categories, selected, onSelectChange, onToggle, onUpdate, onDelete,
}: Props) {
  const [saving, setSaving] = useState(false);

  async function patch(p: Partial<Todo>) {
    setSaving(true);
    try { await onUpdate(todo.id, p); } finally { setSaving(false); }
  }

  const pr = useMemo(() => PRIORITY_META[todo.priority], [todo.priority]);

  return (
    <Card className="rounded-xl border bg-card/80 p-4 shadow-sm transition-all hover:shadow-md">
      {/* Fila 1: checkboxes + título + prioridad + fecha + borrar */}
      <div className="grid items-center gap-3 md:grid-cols-[auto,1fr,auto,auto,auto]">
        {/* checks */}
        <div className="flex items-center gap-3">
          <Checkbox checked={selected} onCheckedChange={(v) => onSelectChange(Boolean(v))} />
          <Checkbox checked={todo.completed} onCheckedChange={(v) => onToggle(todo.id, Boolean(v))} />
        </div>

        {/* título (expandible) */}
        <Input
          className="w-full"
          value={todo.title}
          onChange={(e) => patch({ title: e.target.value })}
          disabled={saving}
        />

        {/* prioridad con punto de color */}
        <div className="hidden md:block">
          <Select
            value={todo.priority}
            onValueChange={(v) => patch({ priority: v as Todo['priority'] })}
          >
            <SelectTrigger className="w-40 justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${pr.dot}`} />
                <SelectValue placeholder="Prioridad" />
              </div>
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              align="start"
              className="z-50 w-[--radix-select-trigger-width] min-w-[12rem]"
            >
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Baja
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Media
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Alta
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* fecha */}
        <div className="hidden md:block">
          <Input
            type="date"
            className="w-[160px]"
            value={todo.due_date ?? ''}
            onChange={(e) => patch({ due_date: e.target.value || null })}
            disabled={saving}
          />
        </div>

        {/* borrar */}
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(todo.id)}
            disabled={saving}
            aria-label="Eliminar"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* En móviles mostramos prioridad y fecha debajo (no ocupan la fila principal) */}
        <div className="md:hidden col-span-full grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">Prioridad</Label>
            <Select
              value={todo.priority}
              onValueChange={(v) => patch({ priority: v as Todo['priority'] })}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${pr.dot}`} />
                  <SelectValue placeholder="Prioridad" />
                </div>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                align="start"
                className="z-50 w-[--radix-select-trigger-width] min-w-[12rem]"
              >
                <SelectItem value="low"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Baja</div></SelectItem>
                <SelectItem value="medium"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Media</div></SelectItem>
                <SelectItem value="high"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Alta</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">Vence</Label>
            <Input
              type="date"
              value={todo.due_date ?? ''}
              onChange={(e) => patch({ due_date: e.target.value || null })}
              disabled={saving}
            />
          </div>
        </div>
      </div>

      {/* Fila 2: categoría alineada bajo el título */}
      <div className="mt-3 grid md:grid-cols-[auto,1fr,auto,auto,auto]">
        <div className="md:col-start-2 md:col-span-2">
          <Label className="text-xs text-muted-foreground">Categoría</Label>
          <Select
            value={todo.category_id ?? 'none'}
            onValueChange={(v) => patch({ category_id: v === 'none' ? null : v })}
          >
            <SelectTrigger className="mt-1 w-full md:w-64">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={6}
              align="start"
              className="z-50 w-[--radix-select-trigger-width] min-w-[16rem]"
            >
              <SelectItem value="none">(Sin categoría)</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
