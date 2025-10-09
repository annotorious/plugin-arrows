import { atom } from 'nanostores';
import { createNanoEvents, type Unsubscribe } from 'nanoevents';
import { Arrow } from '@/types';
import { ArrowStoreEvents } from './arrow-store-events';

export const createArrowStore = () => {

  const arrows = atom<Arrow[]>([]);

  const emitter = createNanoEvents<ArrowStoreEvents>();

  const addArrow = (arrow: Arrow) => {
    arrows.set([...arrows.get(), arrow]);
    emitter.emit('createArrow', arrow);
  }

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

  const on = <E extends keyof ArrowStoreEvents>(event: E, callback: ArrowStoreEvents[E]) => 
    emitter.on(event, callback);

  return {
    arrows,
    addArrow,
    on,
    removeArrow,
    updateArrow
  }

}

export type ArrowStore = ReturnType<typeof createArrowStore>;