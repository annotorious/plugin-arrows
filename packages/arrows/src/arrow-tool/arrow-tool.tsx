import { createSignal, onCleanup, onMount } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import type { ImageAnnotation, ImageAnnotationStore } from '@annotorious/annotorious';
import { Arrow, ArrowAnchor, Point } from '@/types';
import { SvgArrow } from '@/arrows-layer/svg-arrow';
import { SvgEmphasis } from './svg-emphasis';

interface ArrowToolProps {

  addEventListener(name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean): () => void;

  annoStore: ImageAnnotationStore<ImageAnnotation>;

  hovered?: ImageAnnotation;

  transform(pt: Point): Point;

  viewportScale?: number;

  onCreateArrow(arrow: Arrow): void;

}

const DRAG_TIME_THRESHOLD = 250;

export const ArrowTool = (props: ArrowToolProps) => {

  const [start, setStart] = createSignal<Point | null>(null);

  const [startAnnotation, setStartAnnotation] = createSignal<ImageAnnotation | null>(null);

  const [cursor, setCursor] = createSignal<Point | null>(null);

  let lastPointerDown: number | null = null;
  
  const createArrow = (start: Point, end: Point): Arrow => {

    const getAnchor = (pt: Point, annotation?: ImageAnnotation): Point | ArrowAnchor => {
      if (!annotation) return pt;

      const { maxX, minX, maxY, minY } = annotation.target.selector.geometry.bounds;
      const cx = (maxX + minX) / 2;
      const cy = (maxY + minY) / 2;

      const offsetX = pt.x - cx;
      const offsetY = pt.y - cy;

      return {
        annotationId: annotation.id,
        offset: { x: offsetX, y: offsetY }
      };
    }
    return {
      id: uuidv4(),
      start: getAnchor(start, startAnnotation()), 
      end: getAnchor(end, props.hovered)
    }
  }

  const onPointerDown = (evt: PointerEvent) => {
    const pt = props.transform({ x: evt.offsetX, y: evt.offsetY });

    const s = start();
    if (!s) {
      setStart(pt);
      setStartAnnotation(props.hovered);
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
      {props.hovered && (
        <SvgEmphasis 
          annotation={props.hovered} 
          style="start" />
      )}
      
      {start() && cursor() && (
        <SvgArrow 
          annoStore={props.annoStore}
          start={start()} 
          end={cursor()} 
          viewportScale={props.viewportScale} />
      )}
    </g>
  )

}