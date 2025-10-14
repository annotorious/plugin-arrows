import type { Annotation, AnnotationTarget, AnnotatorState, ImageAnnotation, ImageAnnotatorState } from '@annotorious/annotorious';
import { ArrowSelection, ArrowStore } from './state';
import { ArrowLifecycleEvents } from './state';

export interface ArrowAnnotation extends Annotation {

  motivation: 'pointing';

  target: ArrowAnnotationTarget;

}

export interface ArrowAnnotationTarget extends AnnotationTarget {

  selector: {
    
    start: Point | ArrowAnchor;

    end: Point | ArrowAnchor;

  }

}

export interface ArrowAnchor {
  
  annotationId: string;

  offset: Point;

}

// Arrow use the generic Annotorious state for their own state management
export type AnnotatorInstanceAnnotation = ImageAnnotation | ArrowAnnotation;

export type AnnotatorInstanceState = ImageAnnotatorState<AnnotatorInstanceAnnotation>; 

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

export const isArrowAnnotation = <T extends Annotation>(annotation: T | ArrowAnnotation): annotation is ArrowAnnotation =>
  (annotation as ArrowAnnotation).motivation !== undefined &&
  (annotation as ArrowAnnotation).motivation === 'pointing';

export const isArrowAnchor = (value: Point | ArrowAnchor): value is ArrowAnchor =>
  value && 'annotationId' in value;