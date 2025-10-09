import { ArrowSelection, ArrowStore } from './state';
import { ArrowStoreEvents } from './state';

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

export interface Arrow {

  id: string;

  start: Point;

  end: Point;

}