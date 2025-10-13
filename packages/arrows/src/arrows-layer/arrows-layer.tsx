import { createEffect, createSignal } from 'solid-js';
import clsx from 'clsx';
import { useStore } from '@nanostores/solid';
import { ImageAnnotation, ImageAnnotationStore } from '@annotorious/annotorious';
import { ArrowEditor } from '@/arrow-editor';
import { ArrowTool } from '@/arrow-tool';
import { Arrow, ArrowsPluginMode, ArrowState, Point } from '@/types';
import { ArrowsLayerAPI } from './arrows-layer-api';
import { SvgArrow } from './svg-arrow';

import styles from './arrows-layer.module.css';

export interface ArrowsLayerProps {

  addEventListener(svg?: SVGSVGElement): (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean) => () => void;

  annoStore: ImageAnnotationStore<ImageAnnotation>;

  class?: string;

  elementToImage(svg?: SVGSVGElement): (pt: Point) => Point;

  scale?: number;

  state: ArrowState;

  transform?: string;
  
  onInit(api: ArrowsLayerAPI): void;

}

export const ArrowsLayer = (props: ArrowsLayerProps) => {

  let svgRef: SVGSVGElement | undefined;

  const [enabled, setEnabled] = createSignal(true);

  const [mode, setMode] = createSignal<ArrowsPluginMode>('select');

  const [hovered, setHovered] = createSignal<ImageAnnotation | undefined>();

  const { store, selection } = props.state;

  const arrows = useStore(store.arrows);

  const selected = useStore(selection.selectedIds);

  props.onInit({
    get isEnabled() {
      return enabled();
    },
    setEnabled,
    setMode
  });

  const onClickedArrow = (arrow: Arrow) => selection.setSelected(arrow);

  const onPointerUp = (evt: PointerEvent) => {
    if (!enabled() || mode() === 'draw') return;

    if (evt.target !== svgRef) return;

    selection.clearSelection();
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (mode() === 'select') return;

    const pt = props.elementToImage(svgRef)({ x: evt.offsetX, y: evt.offsetY });
    const hovered = props.annoStore.getAt(pt.x, pt.y);
    setHovered(hovered);
  }

  createEffect(() => {
    if (!enabled()) selection.clearSelection();
  });

  const onCreateArrow = (arrow: Arrow) => {
    store.addArrow(arrow);
    setHovered(undefined);
  }

  return (
    <svg 
      ref={svgRef}
      class={clsx(
        'a9s-arrows-layer', 
        props.class, 
        styles.container, 
        enabled() && 'enabled',
        mode()
      )}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}>
      <g transform={props.transform}>
        {mode() === 'draw' && (
          <ArrowTool 
            annoStore={props.annoStore}
            addEventListener={props.addEventListener(svgRef)}
            hovered={hovered()}
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onCreateArrow={onCreateArrow} />
        )}

        {arrows().map(arrow => arrow.id === selected() ? (
          <ArrowEditor 
            annoStore={props.annoStore}
            arrow={arrow} 
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onUpdate={store.updateArrow} />
        ) : (
          <SvgArrow 
            annoStore={props.annoStore}
            start={arrow.start} 
            end={arrow.end} 
            viewportScale={props.scale} 
            onClick={() => onClickedArrow(arrow)} />
        ))}
      </g>
    </svg>
  )

}