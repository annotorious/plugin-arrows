import { createMemo } from 'solid-js';
import { computeSVGPath } from '@annotorious/annotorious';
import type { ImageAnnotation, PolylineGeometry } from '@annotorious/annotorious';

interface SvgEmphasisPolylineProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisPolyline = (props: SvgEmphasisPolylineProps) => {

  const d = createMemo(() => {
    const geom = props.annotation.target.selector.geometry as PolylineGeometry;
    return computeSVGPath(geom);
  });

  return (
    <path d={d()} />
  )

}