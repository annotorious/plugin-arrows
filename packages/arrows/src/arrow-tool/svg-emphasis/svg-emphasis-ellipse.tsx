import type { EllipseGeometry, ImageAnnotation } from '@annotorious/annotorious';

interface SvgEmphasisEllipseProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisEllipse = (props: SvgEmphasisEllipseProps) => {

  const { cx, cy, rx, ry } = props.annotation.target.selector.geometry as EllipseGeometry;

  return (
    <ellipse
      data-id={props.annotation.id}
      cx={cx} 
      cy={cy} 
      rx={rx}
      ry={ry} />
  )

}