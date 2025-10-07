import { getArrow } from 'perfect-arrows';
import { Arrow } from '@/types';
import { createMemo } from 'solid-js';
import { Point } from 'dist/types';

interface SvgArrowProps {
  
  start: Point;

  end: Point;

  class?: string;

  viewportScale?: number;

}

export const SvgArrow = (props: SvgArrowProps) => {

  const arrowData = createMemo(() => {
    const { x: x0, y: y0 } = props.start;
    const { x: x1, y: y1 } = props.end;
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
    <g class={`a9s-arrow${props.class ? ` ${props.class}` : ''}`}>
      <path class="a9s-arrow-buffer" d={d()} />
      <path class="a9s-arrow-outer" d={d()} />

      <circle 
        class="a9s-arrow-base"
        cx={arrowData()[0]} 
        cy={arrowData()[1]} 
        r={4 * scale()} />

      <polygon
        class="a9s-arrow-head"
        points="0,-6 12,0, 0,6"
        transform={`translate(${arrowData()[4]},${arrowData()[5]}) rotate(${endAngleAsDegrees()}) scale(${scale()})`} />

      <path class="a9s-arrow-inner" d={d()} />
    </g>
  )

}