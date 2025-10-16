import { createMemo } from 'solid-js';
import type { ImageAnnotation, PolygonGeometry } from '@annotorious/annotorious';

interface SvgEmphasisPolygonProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisPolygon = (props: SvgEmphasisPolygonProps) => {

  const points = createMemo(() => 
    (props.annotation.target.selector.geometry as PolygonGeometry).points);

  return (
    <polygon points={points().map(xy => xy.join(',')).join(' ')} />
  )

}