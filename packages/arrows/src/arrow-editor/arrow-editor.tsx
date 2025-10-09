import { getArrow } from 'perfect-arrows';
import { createMemo, createSignal } from 'solid-js';
import { Arrow, Point } from '@/types';

interface ArrowEditorProps {

  arrow: Arrow;

  transform(pt: Point): Point;

  viewportScale?: number;

}

export const ArrowEditor = (props: ArrowEditorProps) => {

  let grabbedHandle: string | null = null;

  let origin: Point | null = null;

  const [editedArrow, setEditedArrow] = createSignal<Arrow>(props.arrow);

  const arrowData = createMemo(() => {
    const { x: x0, y: y0 } = editedArrow().start;
    const { x: x1, y: y1 } = editedArrow().end;

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

  const onGrab = (handle: string) => (evt: PointerEvent) => {
    grabbedHandle = handle;

    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
    origin = pt;

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
  }

  const onRelease = () => {
    grabbedHandle = null;
    origin = null;
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle && origin) {
      const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });

      const delta = { x: pt.x - origin.x, y: pt.y - origin.y };

      const add = (a: Point, b: Point) => ({ x: a.x + b.x, y: a.y + b.y });

      setEditedArrow({
        ...props.arrow,
        start: add(props.arrow.start, delta),
        end: add(props.arrow.end, delta)
      });
    }
  }

  return (
    <g 
      class="a9s-arrow a9s-arrow-editor"
      onPointerUp={onRelease} 
      onPointerMove={onPointerMove} >
      <path 
        class="a9s-arrow-buffer" 
        d={d()} 
        onPointerDown={onGrab('arrow')} />

      <path 
        class="a9s-arrow-outer" 
        d={d()} />

      <circle 
        class="a9s-arrow-base"
        cx={arrowData()[0]} 
        cy={arrowData()[1]} 
        r={4 * scale()} />

      <polygon
        class="a9s-arrow-head"
        points="0,-6 12,0, 0,6"
        transform={`translate(${arrowData()[4]},${arrowData()[5]}) rotate(${endAngleAsDegrees()}) scale(${scale()})`} />

      <path
        class="a9s-arrow-inner"
        d={d()} />
    </g>
  )

}