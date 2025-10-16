import { isImageAnnotation, Store } from '@annotorious/annotorious';
import type { AnnotatorInstanceAnnotation, ArrowAnchor, Point } from '@/types';
import { isArrowAnchor } from '@/types';

export const getAnchorPoint = (
  store: Store<AnnotatorInstanceAnnotation>, 
  anchor: Point | ArrowAnchor
): Point | null => {
  if (isArrowAnchor(anchor)) {
    const annotation = store.getAnnotation(anchor.annotationId);
    if (annotation && isImageAnnotation(annotation)) {
        const { bounds } = annotation.target.selector.geometry;
        
        const cx = (bounds.maxX + bounds.minX) / 2;
        const cy = (bounds.maxY + bounds.minY) / 2;

        return {
          x: cx + anchor.offset.x,
          y: cy + anchor.offset.y
        }
    } else {
      return null;
    }
  } else {
    return anchor as Point;
  }
}