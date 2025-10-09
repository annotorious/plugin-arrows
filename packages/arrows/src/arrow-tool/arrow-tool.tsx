import { createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { Arrow, Point } from '@/types';
import { SvgArrow } from '@/arrows-layer/svg-arrow';

interface ArrowToolProps {

  addEventListener(name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean): () => void;

  transform(pt: Point): Point;

  viewportScale?: number;

  onCreateArrow(arrow: Arrow): void;

}

const DRAG_TIME_THRESHOLD = 250;

export const ArrowTool = (props: ArrowToolProps) => {

  const [start, setStart] = createSignal<Point | null>(null);

  const [cursor, setCursor] = createSignal<Point | null>(null);

  let lastPointerDown: number | null = null;

  const onPointerDown = (evt: PointerEvent) => {
    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });

    const s = start();
    if (!s) {
      setStart(pt);
      setCursor(pt);

      lastPointerDown = Date.now(); 
    } else {
      const arrow = { start: s, end: pt };
      props.onCreateArrow(arrow);

      setStart(null);
      setCursor(null);

      lastPointerDown = null;
    }
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (!start()) return;
    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
    setCursor(pt);
  }

  const onPointerUp = (evt: PointerEvent) => {
    const s = start();

    if (!s || lastPointerDown === null) return;

    const duration = Date.now() - lastPointerDown;
    if (duration >= DRAG_TIME_THRESHOLD) {
      const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
      const arrow = { start: s, end: pt };
      props.onCreateArrow(arrow);

      setStart(null);
      setCursor(null);
      
      lastPointerDown = null;
    }
  }

  onMount(() => {
    const cleanups = [
      props.addEventListener('pointerdown', onPointerDown),
      props.addEventListener('pointermove', onPointerMove),
      props.addEventListener('pointerup', onPointerUp)
    ];

    onCleanup(() => {
      cleanups.forEach(dispose => dispose?.());
    });
  });

  return (
    <g class="a9s-arrow a9s-arrow-tool">
      {start() && cursor() && (
        <SvgArrow 
          start={start()} 
          end={cursor()} 
          viewportScale={props.viewportScale} />
      )}
    </g>
  )

}