import { createSignal, onCleanup, onMount } from 'solid-js';
import OpenSeadragon from 'openseadragon';
import { ArrowsLayer, ArrowsLayerAPI } from '@/components';
import { AnnotatorInstanceAnnotation, AnnotatorInstanceState, ArrowsPluginOptions, Point } from '@/types';
import { round } from '@/utils';

interface OpenSeadragonArrowsLayerProps {

  options: ArrowsPluginOptions;

  state: AnnotatorInstanceState;

  viewer: OpenSeadragon.Viewer;

  onInit(api: ArrowsLayerAPI): void;

  onHover(hovered?: AnnotatorInstanceAnnotation): void;

}

export const OpenSeadragonArrowsLayer = (props: OpenSeadragonArrowsLayerProps) => {

  const [transform, setTransform] = createSignal<string | undefined>();

  const [scale, setScale] = createSignal(1);

  const elementToImage = () => (pt: Point) =>
    props.viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(pt.x, pt.y));

  const addEventListener = (svg?: SVGSVGElement) => (
    name: keyof SVGSVGElementEventMap, 
    handler: (evt: Event) => void, 
    capture?: boolean
  ): () => void => {
    const cleanup: Function[] = [];

    svg?.addEventListener(name, handler, capture);
    cleanup.push(() => svg?.removeEventListener(name, handler, capture));

    if (name === 'pointerup' || name === 'dblclick') {
      // OpenSeadragon, by design, stops the 'pointerup' event. In order to capture pointer up events,
      // we need to listen to the canvas-click event instead
      const osdHandler = (event: OpenSeadragon.CanvasClickEvent | OpenSeadragon.CanvasDoubleClickEvent) => {
        const { originalEvent } = event;
        handler(originalEvent as PointerEvent);
      }

      const osdName = name === 'pointerup' ? 'canvas-click' : 'canvas-double-click';
      props.viewer.addHandler(osdName, osdHandler);
      cleanup.push(() => props.viewer.removeHandler(osdName, osdHandler));
    } else if (name === 'pointermove') {
      const dragHandler = (event: OpenSeadragon.CanvasDragEvent) => {
        const { originalEvent } = event;
        handler(originalEvent as PointerEvent);
      }

      props.viewer.addHandler('canvas-drag', dragHandler);
      cleanup.push(() => props.viewer.removeHandler('canvas-drag', dragHandler));
    }

    return () => {
      cleanup.forEach(fn => fn());
    }
  }

  const onUpdateViewport = () => {
    const containerWidth = props.viewer.viewport.getContainerSize().x;

    const zoom = props.viewer.viewport.getZoom(true);
    const flipped = props.viewer.viewport.getFlip();

    const p = props.viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
    if (flipped)
      p.x = containerWidth - p.x;
    
    const scaleY = zoom * containerWidth / props.viewer.world.getContentFactor();
    const scaleX = flipped ? - scaleY : scaleY;

    // @ts-ignore note: getRotation(true <- realtime value) only since OSD 4!
    const rotation = props.viewer.viewport.getRotation(true);

    setTransform(`translate(${p.x}, ${p.y}) scale(${scaleX}, ${scaleY}) rotate(${rotation})`);

    setScale(zoom * containerWidth / props.viewer.world.getContentFactor());
  }

  onMount(() => {
    props.viewer.addHandler('update-viewport', onUpdateViewport);

    onCleanup(() => {
      props.viewer.removeHandler('update-viewport', onUpdateViewport);
    })
  });

  return (
    <ArrowsLayer
      addEventListener={addEventListener}
      elementToImage={elementToImage}
      options={props.options}
      scale={scale()}
      state={props.state}
      transform={transform()}
      onInit={props.onInit} 
      onHover={props.onHover} />
  )

}