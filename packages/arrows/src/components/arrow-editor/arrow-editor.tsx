import { getArrow } from 'perfect-arrows';
import { createEffect, createMemo, createSignal, Show } from 'solid-js';
import { ArrowAnnotation, ArrowAnchor, isArrowAnchor, Point, AnnotatorInstanceState } from '@/types';
import { useAnchorPoint } from '@/hooks';

interface ArrowEditorProps {

  arrow: ArrowAnnotation;

  state: AnnotatorInstanceState;

  transform(pt: Point): Point;

  viewportScale?: number;

}

export const ArrowEditor = (props: ArrowEditorProps) => {

  const { store } = props.state;

  let grabbedHandle: string | null = null;

  let origin: Point | null = null;

  let originalArrow: ArrowAnnotation | null = null;

  const [editedArrow, setEditedArrow] = createSignal<ArrowAnnotation>(props.arrow);

  createEffect(() => setEditedArrow(props.arrow));

  const startPoint = createMemo(() => 
    useAnchorPoint(store, () => editedArrow().target.selector.start)()
  );

  const endPoint = createMemo(() =>
    useAnchorPoint(store, () => editedArrow().target.selector.end)()
  );

  const arrowData = createMemo(() => {
    const start = startPoint();
    const end  = endPoint();

    if (!start || !end) return;

    return getArrow(start.x, start.y, end.x, end.y, {
      stretch: 0.25,
      stretchMax: Infinity,
      padEnd: 12 / (props.viewportScale || 1) 
    });
  });

  const scale = createMemo(() => 1 / (props.viewportScale || 1));

  const onGrab = (handle: string) => (evt: PointerEvent) => {
    grabbedHandle = handle;

    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
    origin = pt;
    originalArrow = props.arrow;

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
  }

  const onRelease = (evt: PointerEvent) => {
    const target = evt.target as Element;
    target.releasePointerCapture(evt.pointerId);

    grabbedHandle = null;
    origin = null;
    originalArrow = null;
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle && origin && originalArrow) {
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

      const { selector } = originalArrow.target;

      const start = (grabbedHandle === 'arrow' ||  grabbedHandle ==='start')
        ? add(selector.start, delta) : selector.start;

      const end = (grabbedHandle === 'arrow' || grabbedHandle === 'end')
        ? add(selector.end, delta) : selector.end;

      const updated = {
        ...originalArrow, 
        target: {
          ...originalArrow.target,
          selector: { start, end }
        }
      };

      setEditedArrow(updated);
      store.updateAnnotation(updated);
    }
  }

  return (
    <Show when={arrowData()}>
      {data => {
        const [sx, sy, cx, cy, ex, ey, angle] = data();
        const d = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;

        return (
          <g
            class="a9s-arrow a9s-arrow-editor"
            onPointerUp={onRelease}
            onPointerMove={onPointerMove}>
            <path
              class="a9s-arrow-buffer"
              d={d}
              onPointerDown={onGrab('arrow')} />

            <path
              class="a9s-arrow-outer"
              d={d} />

            <circle
              class="a9s-arrow-base"
              cx={sx}
              cy={sy}
              r={4 * scale()}
              onPointerDown={onGrab('start')} />

            <polygon
              class="a9s-arrow-head"
              points="0,-6 12,0, 0,6"
              transform={`translate(${ex},${ey}) rotate(${angle * (180 / Math.PI)}) scale(${scale()})`}
              onPointerDown={onGrab('end')} />

            <path
              class="a9s-arrow-inner"
              d={d} />
          </g>
        );
      }}
    </Show>
  )

}