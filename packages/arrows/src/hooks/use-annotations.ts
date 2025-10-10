import { createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import type { ImageAnnotation, ImageAnnotationStore, StoreChangeEvent } from '@annotorious/annotorious';
import { isArrowAnchor } from '@/types';
import type { ArrowAnchor, Point } from '@/types';

export const useAnnotation = (store: ImageAnnotationStore<ImageAnnotation>, id: string) => {

  const [annotation, setAnnotation] = createSignal<ImageAnnotation | null>(store.getAnnotation(id));

  onMount(() => {
    const onStoreChange = ((event: StoreChangeEvent<ImageAnnotation>) => {
      const { created: c, deleted: d, updated: u } = event.changes;

      const created = c.find(a => a.id === id);
      const deleted = d.find(a => a.id === id);
      const updated = u.find(u => u.oldValue.id === id)?.newValue;

      if (updated) 
        setAnnotation(updated);
      else if (deleted)
        setAnnotation(null);
      else if (created)
        setAnnotation(created);
    });

    store.observe(onStoreChange, { annotations: id });

    onCleanup(() => {
      store.unobserve(onStoreChange);
    });
  });

  return annotation;

}

export const useAnchorPoint = (store: ImageAnnotationStore<ImageAnnotation>, anchor: () => Point | ArrowAnchor) => {

  const annotation = isArrowAnchor(anchor()) ? useAnnotation(store, (anchor() as ArrowAnchor).annotationId) : null;

  return createMemo(() => {
    const currentAnchor = anchor();
    
    if (isArrowAnchor(currentAnchor) && annotation) {
      const { bounds } = annotation().target.selector.geometry;
      
      const cx = (bounds.maxX + bounds.minX) / 2;
      const cy = (bounds.maxY + bounds.minY) / 2;

      return {
        x: cx + currentAnchor.offset.x,
        y: cy + currentAnchor.offset.y
      };
    }
    
    return currentAnchor as Point;
  });

}