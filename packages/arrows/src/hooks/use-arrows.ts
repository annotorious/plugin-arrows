import { createSignal, onCleanup, onMount } from 'solid-js';
import type { Annotation, ImageAnnotation, ImageAnnotationStore, StoreChangeEvent } from '@annotorious/annotorious';
import { isArrowAnnotation, type ArrowAnnotation } from '@/types';

export const useArrows = (store: ImageAnnotationStore<ImageAnnotation | ArrowAnnotation>) => {

  const [arrows, setArrows] = createSignal<ArrowAnnotation[]>(store.all().filter(isArrowAnnotation));

  onMount(() => {
    const onStoreChange = (event: StoreChangeEvent<Annotation>) => {
      const created = event.changes.created?.filter(isArrowAnnotation);
      const updated = event.changes.updated?.filter(u => isArrowAnnotation(u.newValue));
      const deleted = event.changes.deleted?.filter(isArrowAnnotation);

      if (created || updated || deleted) {
        setArrows(current => {
          const deletedIds = new Set(deleted?.map(a => a.id));
          const updatedMap = new Map(updated?.map(u => [u.newValue.id, u.newValue]));

          return [
            ...current.filter(a => !deletedIds.has(a.id) && !updatedMap.has(a.id)),
            ...(updated?.map(u => u.newValue as ArrowAnnotation) ?? []),
            ...(created ?? [])
          ];
        });
      }
    }

    store.observe(onStoreChange);

    onCleanup(() => {
      store.unobserve(onStoreChange);
    });
  });

  return arrows;

}