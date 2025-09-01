'use client';

import { Button } from '@/components/ui/button';

type Priority = 'low' | 'medium' | 'high';

export default function BulkActions({
  selectedIds,
  clear,
  onSetCompleted,
  onSetPriority,
  onDelete,
}: {
  selectedIds: string[];
  clear: () => void;
  onSetCompleted: (value: boolean) => Promise<void>;
  onSetPriority: (p: Priority) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-30 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2">
      <div className="flex items-center justify-between gap-3 rounded-full border bg-background/90 px-4 py-2 shadow-lg backdrop-blur">
        <span className="text-sm text-muted-foreground">
          {selectedIds.length} seleccionada{selectedIds.length > 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => onSetCompleted(true)}>Completar</Button>
          <Button variant="secondary" onClick={() => onSetCompleted(false)}>Activar</Button>
          <Button variant="outline" onClick={() => onSetPriority('low')}>Baja</Button>
          <Button variant="outline" onClick={() => onSetPriority('medium')}>Media</Button>
          <Button variant="outline" onClick={() => onSetPriority('high')}>Alta</Button>
          <Button variant="destructive" onClick={onDelete}>Eliminar</Button>
          <Button variant="ghost" onClick={clear}>Limpiar</Button>
        </div>
      </div>
    </div>
  );
}
