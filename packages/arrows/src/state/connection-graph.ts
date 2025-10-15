import { ImageAnnotation, isImageAnnotation, Store, StoreChangeEvent } from '@annotorious/annotorious';
import type { AnnotatorInstanceAnnotation, ArrowAnnotation } from '@/types';
import { isArrowAnchor, isArrowAnnotation } from '@/types';

export const createConnectionGraph = (store: Store<AnnotatorInstanceAnnotation>) => {

  const arrows: ArrowAnnotation[] = [];

  // Return arrows connected to the given image annotation
  const getConnected = (imageAnnotation: ImageAnnotation) =>
    arrows.filter(a => {
      const { start, end } = a.target.selector;
      
      if (isArrowAnchor(start) && start.annotationId === imageAnnotation.id)
        return true;

      if (isArrowAnchor(end) && end.annotationId === imageAnnotation.id)
        return true;

      return false;
    });

  // Keep track of new arrows that connect anntoations
  const onCreateAnnotation = (a: AnnotatorInstanceAnnotation) => {
    if (isArrowAnnotation(a)) {
      const { start, end } = a.target.selector;

      if (isArrowAnchor(start) || isArrowAnchor(end)) {
        arrows.push(a);
      }
    }
  }

  // Housekeeping: 
  // - if an arrow is deleted, update the arrows array
  // - if an image annotation is deleted, also delete the arrows from the store
  const onDeleteAnnotation = (a: AnnotatorInstanceAnnotation) => {
    const removeArrow = (a: ArrowAnnotation) => {
      const index = arrows.indexOf(a);
      if (index > -1)
        arrows.splice(index, 1);
    }

    if (isArrowAnnotation(a)) {
      removeArrow(a);
    } else if (isImageAnnotation(a)) {
      // If an image annotations is removed, remove connected arrows from the store
      const connected = getConnected(a);
      if (connected.length > 0) {
        store.bulkDeleteAnnotations(connected.map(c => c.id))
        connected.forEach(removeArrow);
      }
    }
  }
 
  const storeObserver = (event: StoreChangeEvent<AnnotatorInstanceAnnotation>) => {
    const { created, deleted } = event.changes;

    (created || []).map(onCreateAnnotation);
    (deleted || []).map(onDeleteAnnotation);
  }
  
  store.observe(storeObserver);

  const destroy = () =>
    store.unobserve(storeObserver);

  return {
    destroy,
    getConnected
  }


}