import { atom } from 'nanostores';
import { Arrow } from '@/types';
import { ArrowStore } from './arrow-store';

export const createArrowSelection = (store: ArrowStore) => {

  const selectedIds = atom<string | null>(null);

  const setSelected = (arrowOrId: string | Arrow) => {
    const id = typeof arrowOrId === 'string' ? arrowOrId : arrowOrId.id;
    selectedIds.set(id);
  }

  const clearSelection = () =>
    selectedIds.set(null);

  const unsubscribe = store.arrows.subscribe(arrows => {
    const selected = selectedIds.get();
    if (selected && !arrows.find(a => a.id === selected))
      selectedIds.set(null);
  });

  return {
    selectedIds,
    setSelected,
    clearSelection,
    destroy: unsubscribe
  }

}

export type ArrowSelection = ReturnType<typeof createArrowSelection>;