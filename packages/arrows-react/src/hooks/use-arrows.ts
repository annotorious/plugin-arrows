import { useMemo } from 'react';
import { useAnnotations } from '@annotorious/react';
import { type AnnotatorInstanceAnnotation, isArrowAnnotation, isConnectedTo } from '@annotorious/plugin-arrows';

/**
 * A utility hook similar to useAnnotations, but filtering 
 * for arrow annotations.
 */
export const useArrows = (connectedTo?: string | string[]) => {

  const annotations = useAnnotations<AnnotatorInstanceAnnotation>();

  const connections = useMemo(() => {
    const arrows = annotations.filter(isArrowAnnotation);

    if (connectedTo) {
      return arrows.filter(a => isConnectedTo(a, connectedTo));
    } else {
      return arrows;
    }
  }, [annotations, connectedTo]);

  return connections;
  
}