import { atom } from 'nanostores';
import type { AnnotatorInstanceState, ArrowAnnotation } from '@/types';

export const createHoverStateBridge = (state: AnnotatorInstanceState) => {

  const hovered = atom<ArrowAnnotation | null>(null);

  // Forward arrow hovers to the Annotorious hover state
  hovered.subscribe(annotation => state.hover.set(annotation?.id));

  return hovered;

}