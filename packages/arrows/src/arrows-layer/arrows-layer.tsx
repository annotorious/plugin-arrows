import { createEffect, createSignal } from 'solid-js';
import clsx from 'clsx';
import { useStore } from '@nanostores/solid';
import { ArrowEditor } from '@/arrow-editor';
import { ArrowTool } from '@/arrow-tool';
import { Arrow, ArrowsPluginMode, ArrowState, Point } from '@/types';
import { ArrowsLayerAPI } from './arrows-layer-api';
import { SvgArrow } from './svg-arrow';

import styles from './arrows-layer.module.css';

export interface ArrowsLayerProps {

  addEventListener(svg?: SVGSVGElement): (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean) => () => void;

  class?: string;

  elementToImage(svg?: SVGSVGElement): (pt: Point) => Point;

  scale?: number;

  state: ArrowState;

  transform?: string;
  
  onInit(api: ArrowsLayerAPI): void;

}

export const ArrowsLayer = (props: ArrowsLayerProps) => {

  let svgRef: SVGSVGElement | undefined;

  const [enabled, setEnabled] = createSignal(false);

  const [mode, setMode] = createSignal<ArrowsPluginMode>('draw');

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

  createEffect(() => {
    if (!enabled()) selection.clearSelection();
  });

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
      onPointerUp={onPointerUp}>
      <g transform={props.transform}>
        {mode() === 'draw' && (
          <ArrowTool 
            addEventListener={props.addEventListener(svgRef)}
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onCreateArrow={store.addArrow} />
        )}

        {arrows().map(arrow => arrow.id === selected() ? (
          <ArrowEditor 
            arrow={arrow} 
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onUpdate={store.updateArrow} />
        ) : (
          <SvgArrow 
            start={arrow.start} 
            end={arrow.end} 
            viewportScale={props.scale} 
            onClick={() => onClickedArrow(arrow)} />
        ))}
      </g>
    </svg>
  )

}