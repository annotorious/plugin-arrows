import { createNanoEvents } from 'nanoevents';
import { ArrowAnnotation } from '@/types';
import { ArrowSelection } from './arrow-selection';
import { ArrowStore } from './arrow-store';

export interface ArrowLifecycleEvents {

  createArrow(arrow: ArrowAnnotation): void;

  selectArrow(arrow?: ArrowAnnotation): void;

}

export const createLifecycleObserver = (store: ArrowStore, selection: ArrowSelection) => {

  const emitter = createNanoEvents<ArrowLifecycleEvents>();

  store.on('createArrow', (arrow) => emitter.emit('createArrow', arrow));

  selection.selectedIds.subscribe((value, oldValue) => {
    emitter.emit('selectArrow', value ? store.getArrow(value) : undefined);
  });

  const on = <E extends keyof ArrowLifecycleEvents>(event: E, callback: ArrowLifecycleEvents[E]) => 
    emitter.on(event, callback);

  return {
    on
  }

}