import { createMemo } from 'solid-js';
import type { ImageAnnotation, RectangleGeometry} from '@annotorious/annotorious';

interface SvgEmphasisRectangleProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisRectangle = (props: SvgEmphasisRectangleProps) => {

  const geom = createMemo(() => {
    const { x, y, w, h } = props.annotation.target.selector.geometry as RectangleGeometry;
    return { x, y, width: w, height: h };
  });

  return (
    <rect
      data-id={props.annotation.id}
      {...geom()} />
  )

}