import { multipolygonElementToPath } from '@annotorious/annotorious';
import type { ImageAnnotation, MultiPolygonGeometry } from '@annotorious/annotorious';

interface SvgEmphasisMultiPolygonProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisMultiPolygon = (props: SvgEmphasisMultiPolygonProps) => {

  const { polygons } = props.annotation.target.selector.geometry as MultiPolygonGeometry;

  return (
    <g>
      {polygons.map(polygon => (
        <path 
          fill-rule="evenodd"
          d={multipolygonElementToPath(polygon)} />
      ))}
    </g>
  )

}
