import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';
import { Active, DataRef, Over } from '@dnd-kit/core';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type DraggableData = ColumnDragData | TaskDragData;
export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

