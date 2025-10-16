import { createSignal, onCleanup, onMount } from 'solid-js';
import { isImageAnnotation, type HoverState, type ImageAnnotation } from '@annotorious/annotorious';
import { AnnotatorInstanceState } from '@/types';

export const useHover = (state: AnnotatorInstanceState) => {

  const [hovered, setHovered] = createSignal<ImageAnnotation | undefined>();

  onMount(() => {
    const { store, hover } = state;

    const unsubscribeHover = hover.subscribe((hovered?: string) => {
      if (hovered) {
        const a = store.getAnnotation(hovered);
        setHovered(a && isImageAnnotation(a) ? a : undefined);
      } else {
        setHovered();
      }
    });

    onCleanup(() => {
      unsubscribeHover();
    })
  });

  return [hovered, setHovered] as const;

}