
import type { FragmentSelector, W3CAnnotation } from '@annotorious/annotorious';

export const isW3CArrowLinkAnnotation = (arg: any): arg is W3CArrowLinkAnnotation =>
  arg.motivation === 'linking' &&
  arg.body?.selector?.type === 'FragmentSelector' && 
  arg.target?.selector?.type === 'FragmentSelector' &&
  (arg.body?.type === 'Annotation' || arg.body?.type === 'Image') && 
  (arg.target?.type === 'Annotation' || arg.target?.type === 'Image');

export const isW3CArrowMetaAnnotation = (arg: any): arg is W3CArrowMetaAnnotation =>
  arg.motivation === 'tagging' && typeof arg.target === 'string';

export interface W3CArrowLinkAnnotation extends Omit<W3CAnnotation, 'body' | 'target'> {

  motivation: 'linking';

  body: W3CArrowLinkEdge;

  target: W3CArrowLinkEdge;

}

export interface W3CArrowLinkEdge {

  source: string;

  type: 'Annotation' | 'Image';

  selector: FragmentSelector;

}

export interface W3CArrowMetaAnnotation extends Omit<W3CAnnotation, 'target'> {

  motivation?: 'tagging',

  target: string;

}

