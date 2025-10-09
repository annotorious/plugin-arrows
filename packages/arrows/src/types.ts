import { ArrowSelection, ArrowStore } from './state';

export type ArrowsPluginMode = 'draw' | 'select';

export interface ArrowsPluginInstance {

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