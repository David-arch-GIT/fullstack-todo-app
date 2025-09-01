'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

type Category = { id: string; name: string };

type AddTodoPayload = {
  title: string;
  description?: string | null;
  due_date?: string | null;          // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  category_id?: string | null;
};

type Props = {
  categories: Category[];
  onCreate: (payload: AddTodoPayload) => Promise<void>;
};

export default function AddTodoForm({ categories, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState(false);

  const canSubmit = title.trim().length >= 3 && !pending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setPending(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        due_date: dueDate || null,
        priority,
        category_id: categoryId ?? null,
      });

      // limpiar
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategoryId(undefined);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Ej. Preparar demo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Detalles opcionales"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Fecha */}
          <div className="grid gap-2">
            <Label htmlFor="due">Vence</Label>
            <Input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Prioridad (arreglo de superposición/anchos) */}
          <div className="grid gap-2">
            <Label>Prioridad</Label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                align="start"
                className="z-50 w-[--radix-select-trigger-width] min-w-[12rem]"
              >
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoría (arreglo de superposición/anchos) */}
          <div className="grid gap-2">
            <Label>Categoría</Label>
            <Select
              value={categoryId ?? 'none'}
              onValueChange={(v) => setCategoryId(v === 'none' ? undefined : v)}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="(Opcional)" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                align="start"
                className="z-50 w-[--radix-select-trigger-width] min-w-[14rem]"
              >
                <SelectItem value="none">(Sin categoría)</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={!canSubmit}>
            {pending ? 'Guardando…' : 'Añadir tarea'}
          </Button>
        </div>
      </div>
    </form>
  );
}
