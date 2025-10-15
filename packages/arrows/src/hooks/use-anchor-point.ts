import { Accessor, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { isImageAnnotation } from '@annotorious/annotorious';
import type { ImageAnnotation, ImageAnnotationStore, StoreChangeEvent } from '@annotorious/annotorious';
import { isArrowAnchor } from '@/types';
import type { AnnotatorInstanceAnnotation, ArrowAnchor, Point } from '@/types';

const useAnnotation = (store: ImageAnnotationStore<AnnotatorInstanceAnnotation>, id: string) => {

  const [annotation, setAnnotation] = createSignal<AnnotatorInstanceAnnotation | null>(store.getAnnotation(id));

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

export const useAnchorPoint = (
  store: ImageAnnotationStore<AnnotatorInstanceAnnotation>, 
  anchor: () => Point | ArrowAnchor
): Accessor<Point | null> => {

  const annotation = isArrowAnchor(anchor()) ? useAnnotation(store, (anchor() as ArrowAnchor).annotationId) : null;

  return createMemo(() => {
    const currentAnchor = anchor();
    const a = annotation?.();

    if (isArrowAnchor(currentAnchor)) {
      if (a && isImageAnnotation(a)) {
        const { bounds } = a.target.selector.geometry;
        
        const cx = (bounds.maxX + bounds.minX) / 2;
        const cy = (bounds.maxY + bounds.minY) / 2;

        return {
          x: cx + currentAnchor.offset.x,
          y: cy + currentAnchor.offset.y
        }
      } else {
        return null;
      }
    } else {
      return anchor() as Point;
    }
  });

}