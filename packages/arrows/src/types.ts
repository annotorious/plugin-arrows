export interface ArrowsPluginInstance {

  setEnabled(enabled: boolean): void;

  unmount(): void;

}

export interface Point {

  x: number;

  y: number;

}

export interface Arrow {

  start: Point;

  end: Point;

}