import { ArrowAnnotation, isArrowAnchor } from '@/types';

export const isConnectedTo = (arrow: ArrowAnnotation, annotationIdOrIds: string | string[]) => {
  const { start, end } = arrow.target.selector;
  const ids = new Set(Array.isArray(annotationIdOrIds) ? annotationIdOrIds : [annotationIdOrIds]);

  return (isArrowAnchor(start) && ids.has(start.annotationId)) ||
    (isArrowAnchor(end) && ids.has(end.annotationId));
}