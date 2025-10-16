import type { 
  Annotation, 
  AnnotationTarget, 
  ImageAnnotation, 
  ImageAnnotatorState 
} from '@annotorious/annotorious';

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

export type AnnotatorInstanceAnnotation = ImageAnnotation | ArrowAnnotation;

export type AnnotatorInstanceState = ImageAnnotatorState<AnnotatorInstanceAnnotation>; 

export interface ArrowsPluginOptions {

  showArrows?: ArrowsVisibility;

}

export type ArrowsVisibility = 'ALWAYS' | 'HOVER_ONLY' | 'SELECTED_ONLY' | 'HOVER_OR_SELECT';

export interface ArrowsPluginInstance {

  setEnabled(enabled: boolean): void;

  setMode(mode: ArrowsPluginMode): void;

  unmount(): void;

}

export type ArrowsPluginMode = 'draw' | 'select';

export interface Point {

  x: number;

  y: number;

}

export const isArrowAnnotation = <T extends Annotation>(annotation?: T | ArrowAnnotation): annotation is ArrowAnnotation =>
  (annotation as ArrowAnnotation)?.motivation !== undefined &&
  (annotation as ArrowAnnotation)?.motivation === 'pointing';

export const isArrowAnchor = (value: Point | ArrowAnchor): value is ArrowAnchor =>
  value && 'annotationId' in value;