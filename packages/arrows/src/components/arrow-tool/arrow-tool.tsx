import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import type { ImageAnnotation } from '@annotorious/annotorious';
import type { ArrowAnnotation, ArrowAnchor, Point, AnnotatorInstanceState } from '@/types';
import { round } from '@/utils';
import { SvgArrow } from '@/components/arrows-layer/svg-arrow';
import { SvgEmphasis } from './svg-emphasis';

interface ArrowToolProps {

  addEventListener(name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean): () => void;

  state: AnnotatorInstanceState;

  hovered?: ImageAnnotation;

  transform(pt: Point): Point;

  viewportScale?: number;

  onCreateArrow(arrow: ArrowAnnotation): void;

}

const DRAG_TIME_THRESHOLD = 250;

const isPointerLikeEvent = (evt: Event): evt is Event & { offsetX: number; offsetY: number } =>
  'offsetX' in evt &&
  typeof evt.offsetX === 'number' &&
  'offsetY' in evt &&
  typeof evt.offsetY === 'number';

export const ArrowTool = (props: ArrowToolProps) => {

  const [start, setStart] = createSignal<Point | null>(null);

  const [startAnnotation, setStartAnnotation] = createSignal<ImageAnnotation | null>(null);

  const [cursor, setCursor] = createSignal<Point | null>(null);

  let lastPointerDown: number | null = null;
  
  const createArrow = (start: Point, end: Point): ArrowAnnotation => {

    const getAnchor = (
      pt: Point,
      annotation?: ImageAnnotation | null
    ): Point | ArrowAnchor => {
      if (!annotation) return ({
        x: round(pt.x),
        y: round(pt.y)
      });

      const { maxX, minX, maxY, minY } = annotation.target.selector.geometry.bounds;
      const cx = (maxX + minX) / 2;
      const cy = (maxY + minY) / 2;

      const offsetX = round(pt.x - cx);
      const offsetY = round(pt.y - cy);

      return {
        annotationId: annotation.id,
        offset: { x: offsetX, y: offsetY }
      };
    }

    const id = uuidv4();

    return {
      id,
      motivation: 'pointing',
      bodies: [],
      target: {
        annotation: id,
        created: new Date(),
        selector: {
          start: getAnchor(start, startAnnotation()), 
          end: getAnchor(end, props.hovered)
        }
      }
    }
  }

  const onPointerDown = (evt: Event) => {
    if (!isPointerLikeEvent(evt)) return;

    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });

    const s = start();
    if (!s) {
      setStart(pt);
      setStartAnnotation(props.hovered ?? null);
      setCursor(pt);

      lastPointerDown = Date.now(); 
    } else {
      props.onCreateArrow(createArrow(s, pt));

      setStart(null);
      setStartAnnotation(null);
      setCursor(null);

      lastPointerDown = null;
    }
  }

  const onPointerMove = (evt: Event) => {
    if (!isPointerLikeEvent(evt)) return;

    if (!start()) return;
    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
    setCursor(pt);
  }

  const onPointerUp = (evt: Event) => {
    if (!isPointerLikeEvent(evt)) return;

    const s = start();

    if (!s || lastPointerDown === null) return;

    const duration = Date.now() - lastPointerDown;
    if (duration >= DRAG_TIME_THRESHOLD) {
      const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });
      props.onCreateArrow(createArrow(s, pt));

      setStart(null);
      setStartAnnotation(null);
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
      <Show when={props.hovered}>
        {annotation => (
          <SvgEmphasis
            annotation={annotation()}
            style="start" />
        )}
      </Show>
      
      <Show when={start()}>
        {startPoint => (
          <Show when={cursor()}>
            {cursorPoint => (
              <SvgArrow
                state={props.state}
                start={startPoint()}
                end={cursorPoint()}
                viewportScale={props.viewportScale} />
            )}
          </Show>
        )}
      </Show>
    </g>
  )

}