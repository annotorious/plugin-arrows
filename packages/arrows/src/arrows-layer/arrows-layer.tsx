import { createEffect, createSignal } from 'solid-js';
import clsx from 'clsx';
import { ImageAnnotation } from '@annotorious/annotorious';
import { ArrowEditor } from '@/arrow-editor';
import { ArrowTool } from '@/arrow-tool';
import { useArrows, useSelection } from '@/hooks';
import { AnnotatorInstanceState, ArrowAnnotation, ArrowsPluginMode, isArrowAnnotation, Point } from '@/types';
import { ArrowsLayerAPI } from './arrows-layer-api';
import { SvgArrow } from './svg-arrow';

import styles from './arrows-layer.module.css';

export interface ArrowsLayerProps {

  addEventListener(svg?: SVGSVGElement): (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean) => () => void;

  state: AnnotatorInstanceState;

  class?: string;

  elementToImage(svg?: SVGSVGElement): (pt: Point) => Point;

  scale?: number;

  transform?: string;
  
  onInit(api: ArrowsLayerAPI): void;

}

export const ArrowsLayer = (props: ArrowsLayerProps) => {

  let svgRef: SVGSVGElement | undefined;

  const [enabled, setEnabled] = createSignal(true);

  const [mode, setMode] = createSignal<ArrowsPluginMode>('select');

  const [hovered, setHovered] = createSignal<ImageAnnotation | undefined>();

  const { store, selection } = props.state;

  const arrows = useArrows(store);

  props.onInit({
    get isEnabled() {
      return enabled();
    },
    setEnabled,
    setMode
  });

  const onClickedArrow = (arrow: ArrowAnnotation, evt: MouseEvent) => 
    selection.userSelect(arrow.id, evt as PointerEvent);

  const onPointerUp = (evt: PointerEvent) => {
    if (!enabled() || mode() === 'draw') return;

    if (evt.target !== svgRef) return;
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (mode() === 'select') return;

    const pt = props.elementToImage(svgRef)({ x: evt.offsetX, y: evt.offsetY });
    const hovered = store.getAt(pt.x, pt.y);

    if (!isArrowAnnotation(hovered))
      setHovered(hovered);
  }

  createEffect(() => {
    if (mode() === 'draw') selection.clear();
  });

  const onCreateArrow = (arrow: ArrowAnnotation) => {
    store.addAnnotation(arrow);
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
            addEventListener={props.addEventListener(svgRef)}
            hovered={hovered()}
            state={props.state}
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onCreateArrow={onCreateArrow} />
        )}

        {arrows().map(arrow => selection.isSelected(arrow) ? (
          <ArrowEditor 
            arrow={arrow} 
            state={props.state}
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onUpdate={store.updateAnnotation} />
        ) : (
          <SvgArrow 
            state={props.state}
            start={arrow.target.selector.start} 
            end={arrow.target.selector.end} 
            viewportScale={props.scale} 
            onClick={evt => onClickedArrow(arrow, evt)} />
        ))}
      </g>
    </svg>
  )

}