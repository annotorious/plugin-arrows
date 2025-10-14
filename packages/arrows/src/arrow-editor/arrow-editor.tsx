import { getArrow } from 'perfect-arrows';
import { createMemo, createSignal } from 'solid-js';
import { ArrowAnnotation, ArrowAnchor, isArrowAnchor, Point, AnnotatorInstanceState } from '@/types';
import { useAnchorPoint } from '@/hooks';

interface ArrowEditorProps {

  arrow: ArrowAnnotation;

  state: AnnotatorInstanceState;

  transform(pt: Point): Point;

  viewportScale?: number;

  onUpdate(arrow: ArrowAnnotation): void;

}

export const ArrowEditor = (props: ArrowEditorProps) => {

  let grabbedHandle: string | null = null;

  let origin: Point | null = null;

  const [editedArrow, setEditedArrow] = createSignal<ArrowAnnotation>(props.arrow);

  const startPoint = useAnchorPoint(props.state.store, () => 
    editedArrow().target.selector.start);

  const endPoint = useAnchorPoint(props.state.store, () => 
    editedArrow().target.selector.end);

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

  const onGrab = (handle: string) => (evt: PointerEvent) => {
    grabbedHandle = handle;

    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
    origin = pt;

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
  }

  const onRelease = (evt: PointerEvent) => {
    const target = evt.target as Element;
    target.releasePointerCapture(evt.pointerId);

    grabbedHandle = null;
    origin = null;

    props.onUpdate(editedArrow());
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle && origin) {
      const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
      const delta = { x: pt.x - origin.x, y: pt.y - origin.y };

      const add = (anchor: Point | ArrowAnchor, delta: Point) => {
        if (isArrowAnchor(anchor)) {
          const { annotationId, offset } = anchor;
          return { 
            annotationId, 
            offset: { x: offset.x + delta.x, y: offset.y + delta.y }
          } as ArrowAnchor;
        } else {
          return { x: anchor.x + delta.x, y: anchor.y + delta.y };
        }
      }

      const { selector } = props.arrow.target;

      const start = (grabbedHandle === 'arrow' ||  grabbedHandle ==='start')
        ? add(selector.start, delta) : selector.start;

      const end = (grabbedHandle === 'arrow' || grabbedHandle === 'end')
        ? add(selector.end, delta) : selector.end;

      setEditedArrow({...props.arrow, start, end });
    }
  }

  return (
    <g 
      class="a9s-arrow a9s-arrow-editor"
      onPointerUp={onRelease} 
      onPointerMove={onPointerMove}>
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
        r={4 * scale()} 
        onPointerDown={onGrab('start')} />

      <polygon
        class="a9s-arrow-head"
        points="0,-6 12,0, 0,6"
        transform={`translate(${arrowData()[4]},${arrowData()[5]}) rotate(${endAngleAsDegrees()}) scale(${scale()})`} 
        onPointerDown={onGrab('end')} />

      <path
        class="a9s-arrow-inner"
        d={d()} />
    </g>
  )

}