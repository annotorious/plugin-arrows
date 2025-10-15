import { useMemo } from 'react';
import { useAnnotations } from '@annotorious/react';
import { type AnnotatorInstanceAnnotation, isArrowAnnotation } from '@annotorious/plugin-arrows';

/**
 * A utility hook similar to useAnnotations, but filtering 
 * for arrow annotations.
 */
export const useConnections = () => {

  const annotations = useAnnotations<AnnotatorInstanceAnnotation>();

  const connections = useMemo(() => (
    annotations.filter(isArrowAnnotation)
  ), [annotations]);

  return connections;
  
}