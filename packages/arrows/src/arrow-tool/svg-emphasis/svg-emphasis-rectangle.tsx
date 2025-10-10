import type { ImageAnnotation, RectangleGeometry} from '@annotorious/annotorious';

interface SvgEmphasisRectangleProps {

  annotation: ImageAnnotation;

}

export const SvgEmphasisRectangle = (props: SvgEmphasisRectangleProps) => {

  const { x, y, w, h } = props.annotation.target.selector.geometry as RectangleGeometry;

  return (
    <g class="a9s-annotation-emphasis" data-id={props.annotation.id}>
      <rect
        x={x} 
        y={y} 
        width={w} 
        height={h} />
    </g>
  )

}