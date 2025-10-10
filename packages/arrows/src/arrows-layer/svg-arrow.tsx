import { createMemo } from 'solid-js';
import { getArrow } from 'perfect-arrows';
import { clsx } from 'clsx';
import { Point } from 'dist/types';
import { ArrowAnchor } from '@/types';
import { useAnchorPoint } from '@/hooks/use-annotations';
import type { ImageAnnotation, ImageAnnotationStore } from '@annotorious/annotorious';

interface SvgArrowProps {

  annoStore: ImageAnnotationStore<ImageAnnotation>;
  
  start: Point | ArrowAnchor;

  end: Point | ArrowAnchor;

  class?: string;

  viewportScale?: number;

  onClick?(): void;

}

export const SvgArrow = (props: SvgArrowProps) => {

  const startPoint = useAnchorPoint(props.annoStore, () => props.start);
  const endPoint = useAnchorPoint(props.annoStore, () => props.end);
  
  const arrowData = createMemo(() => {
    const { x: x0, y: y0 } = startPoint();
    const { x: x1, y: y1 } = endPoint();
    
    return getArrow(x0, y0, x1, y1, {
      stretch: 0.25,
      stretchMax: Infinity,
      padEnd: 12 / (props.viewportScale || 1) 
    });
  });

  const scale = createMemo(() => 1 / (props.viewportScale || 1));

  const endAngleAsDegrees = createMemo(() => {
    const [, , , , , , ae] = arrowData();
    return ae * (180 / Math.PI);
  });

  const d = createMemo(() => {
    const [sx, sy, cx, cy, ex, ey] = arrowData();
    return `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
  });

  return (
    <g class={clsx('a9s-arrow', props.class)}>
      <path 
        class="a9s-arrow-buffer" 
        d={d()} 
        onClick={props.onClick} />

      <path 
        class="a9s-arrow-outer" 
        d={d()} />

      <circle 
        class="a9s-arrow-base"
        cx={arrowData()[0]} 
        cy={arrowData()[1]} 
        r={4 * scale()} 
        onClick={props.onClick} />

      <polygon
        class="a9s-arrow-head"
        points="0,-6 12,0, 0,6"
        transform={`translate(${arrowData()[4]},${arrowData()[5]}) rotate(${endAngleAsDegrees()}) scale(${scale()})`} 
        onClick={props.onClick} />

      <path
        class="a9s-arrow-inner"
        d={d()} />
    </g>
  )

}