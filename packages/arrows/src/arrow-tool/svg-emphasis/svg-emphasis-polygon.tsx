import type { ImageAnnotation, PolygonGeometry } from '@annotorious/annotorious';

interface SvgEmphasisPolygonProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisPolygon = (props: SvgEmphasisPolygonProps) => {

  const { points } = props.annotation.target.selector.geometry as PolygonGeometry;

  return (
    <polygon points={points.map(xy => xy.join(',')).join(' ')} />
  )

}