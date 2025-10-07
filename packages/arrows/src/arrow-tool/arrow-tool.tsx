import { createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { Arrow, Point } from '@/types';
import { SvgArrow } from '@/arrows-layer/svg-arrow';

interface ArrowToolProps {

  addEventListener(name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean): () => void;

  transform(pt: Point): Point;

  viewportScale?: number;

  onCreateArrow(arrow: Arrow): void;

}

export const ArrowTool = (props: ArrowToolProps) => {

  const [start, setStart] = createSignal<Point | null>(null);

  const [cursor, setCursor] = createSignal<Point | null>(null);

  const onPointerDown = (e: PointerEvent) => {
    const pt = props.transform({ x: e.clientX, y: e.clientY });

    const s = start();
    if (!s) {
      setStart(pt);
      setCursor(pt);
    } else {
      if (s) {
        const arrow = { start: s, end: pt };
        props.onCreateArrow(arrow);
      }

      setStart(null);
      setCursor(null);
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!start()) return;
    const pt = props.transform({ x: e.clientX, y: e.clientY });
    setCursor(pt);
  }

  onMount(() => {
    const cleanups = [
      props.addEventListener('pointerdown', onPointerDown),
      props.addEventListener('pointermove', onPointerMove)
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