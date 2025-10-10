import { ArrowSelection, ArrowStore } from './state';
import { ArrowStoreEvents } from './state';

export interface Arrow {

  id: string;

  start: Point | ArrowAnchor;

  end: Point | ArrowAnchor;

}

export interface ArrowAnchor {
  
  annotationId: string;

  offset: Point;

} 

export const isArrowAnchor = (value: Point | ArrowAnchor): value is ArrowAnchor => {
  return 'annotationId' in value;
}

export type ArrowsPluginMode = 'draw' | 'select';

export interface ArrowsPluginInstance {

  on<T extends keyof ArrowStoreEvents>(event: T, callback: ArrowStoreEvents[T]): void;

  setEnabled(enabled: boolean): void;

  setMode(mode: ArrowsPluginMode): void;

  unmount(): void;

}

export interface ArrowState {

  store: ArrowStore;

  selection: ArrowSelection;

}

export interface Point {

  x: number;

  y: number;

}