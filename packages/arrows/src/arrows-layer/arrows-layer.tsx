import { createSignal } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { ArrowTool } from '@/arrow-tool';
import { Arrow, ArrowsPluginMode, ArrowState, Point } from '@/types';
import { ArrowsLayerAPI } from './arrows-layer-api';
import { SvgArrow } from './svg-arrow';

import styles from './arrows-layer.module.css';

export interface ArrowsLayerProps {

  onInit(api: ArrowsLayerAPI): void;

  state: ArrowState;

  scale?: number;

  transform?: string;

  elementToImage(svg?: SVGSVGElement): (pt: Point) => Point;

  addEventListener(svg?: SVGSVGElement): (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean) => () => void;

}

export const ArrowsLayer = (props: ArrowsLayerProps) => {

  let svgRef: SVGSVGElement | undefined;

  const [enabled, setEnabled] = createSignal(false);

  const [mode, setMode] = createSignal<ArrowsPluginMode>('draw');

  const { store } = props.state;

  const arrows = useStore(store.arrows);

  props.onInit({
    setEnabled,
    setMode
  });

  return (
    <svg 
      ref={svgRef}
      class={`a9s-arrows-layer ${styles.container}${enabled() ? ' enabled': ''}`}>
      <g transform={props.transform}>
        {mode() === 'draw' && (
          <ArrowTool 
            addEventListener={props.addEventListener(svgRef)}
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onCreateArrow={store.addArrow} />
        )}

        {arrows().map(arrow => (
          <SvgArrow 
            start={arrow.start} 
            end={arrow.end} 
            viewportScale={props.scale} />
        ))}
      </g>
    </svg>
  )

}