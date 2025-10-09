import { atom } from 'nanostores';
import { Arrow } from '@/types';

export const createArrowStore = () => {

  const arrows = atom<Arrow[]>([]);

  const addArrow = (arrow: Arrow) =>
    arrows.set([...arrows.get(), arrow]);

  const removeArrow = (id: string) =>
    arrows.set(arrows.get().filter(a => a.id !== id));

  const updateArrow = (arg1: string | Arrow, arg2?: Arrow) => {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const updated = (typeof arg1 === 'string' && arg2) ? arg2 : typeof arg1 !== 'string' ? arg1 : null;

    if (updated) {
      arrows.set(arrows.get().map(a => a.id === id ? updated : a));
    } else {
      console.warn('Invalid update', arg1, arg2);
    }
  }

  return {
    arrows,
    addArrow,
    removeArrow,
    updateArrow
  }

}

export type ArrowStore = ReturnType<typeof createArrowStore>;