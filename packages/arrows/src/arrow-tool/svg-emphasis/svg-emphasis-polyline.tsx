import { computeSVGPath } from '@annotorious/annotorious';
import type { ImageAnnotation, PolylineGeometry } from '@annotorious/annotorious';

interface SvgEmphasisPolylineProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisPolyline = (props: SvgEmphasisPolylineProps) => {

  const geometry = props.annotation.target.selector.geometry as PolylineGeometry;

  const d = computeSVGPath(geometry);

  return (
    <path d={d} />
  )

}