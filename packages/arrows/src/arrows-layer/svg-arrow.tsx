import { getArrow } from 'perfect-arrows';
import { Arrow } from '@/types';
import { createMemo } from 'solid-js';

interface SvgArrowProps {

  arrow: Arrow;

  class?: string;

  viewportScale?: number;

}

export const SvgArrow = (props: SvgArrowProps) => {

  const arrowData = createMemo(() => {
    const { start: { x: x0, y: y0 }, end: { x: x1, y: y1 } } = props.arrow;
    return getArrow(x0, y0, x1, y1, { padEnd: 12 });
  });

  const [sx, sy, cx, cy, ex, ey, ae] = arrowData();

  const scale = props.viewportScale || 1;

  const endAngleAsDegrees = ae * (180 / Math.PI);

  const d = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;

  return (
    <g class={`a9s-arrow${props.class ? ` ${props.class}` : ''}`}>
      <path class="a9s-arrow-buffer" d={d} />
      <path class="a9s-arrow-outer" d={d} />

      <circle 
        class="a9s-arrow-base"
        cx={sx} 
        cy={sy} 
        r={4 * scale} />

      <polygon
        class="a9s-arrow-head"
        points="0,-6 12,0, 0,6"
        transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees}) scale(${scale})`} />

      <path class="a9s-arrow-inner" d={d} />
    </g>
  )

}