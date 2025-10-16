import { For, createMemo } from 'solid-js';
import { multipolygonElementToPath } from '@annotorious/annotorious';
import type { ImageAnnotation, MultiPolygonGeometry } from '@annotorious/annotorious';

interface SvgEmphasisMultiPolygonProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisMultiPolygon = (props: SvgEmphasisMultiPolygonProps) => {

  const polygons = createMemo(() => 
    (props.annotation.target.selector.geometry as MultiPolygonGeometry).polygons
  );

  return (
    <g>
      <For each={polygons()}>
        {(polygon) => (
          <path 
            fill-rule="evenodd"
            d={multipolygonElementToPath(polygon)} />
        )}
      </For>
    </g>
  )

}
