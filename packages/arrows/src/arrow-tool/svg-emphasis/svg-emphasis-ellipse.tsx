import { createMemo } from 'solid-js';
import type { EllipseGeometry, ImageAnnotation } from '@annotorious/annotorious';

interface SvgEmphasisEllipseProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisEllipse = (props: SvgEmphasisEllipseProps) => {

  const geom = createMemo(() => 
    props.annotation.target.selector.geometry as EllipseGeometry);

  return (
    <ellipse
      data-id={props.annotation.id}
      {...geom()} />
  )

}