import { atom } from 'nanostores';
import { createNanoEvents } from 'nanoevents';
import { Arrow } from '@/types';
import { ArrowLifecycleEvents } from './arrow-lifecycle-events';

export const createArrowStore = () => {

  const arrows = atom<Arrow[]>([]);

  const emitter = createNanoEvents<ArrowLifecycleEvents>();

  const getArrow = (id: string) => arrows.get().find(a => a.id === id);

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

  const on = <E extends keyof ArrowLifecycleEvents>(event: E, callback: ArrowLifecycleEvents[E]) => 
    emitter.on(event, callback);

  return {
    arrows,
    addArrow,
    getArrow,
    on,
    removeArrow,
    updateArrow
  }

}

export type ArrowStore = ReturnType<typeof createArrowStore>;