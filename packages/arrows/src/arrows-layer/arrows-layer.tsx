import { createSignal } from 'solid-js';
import { ArrowTool } from '@/arrow-tool';
import { Arrow, Point } from '@/types';
import { SvgArrow } from './svg-arrow';

import styles from './arrows-layer.module.css';

interface ArrowsLayerProps {

  onInit(api: ArrowsLayerAPI): void;

}

export interface ArrowsLayerAPI {

  setEnabled(enabled: boolean): void;

}

export const ArrowsLayer = (props: ArrowsLayerProps) => {

  let svgRef: SVGSVGElement | undefined;

  const [enabled, setEnabled] = createSignal(false);

  const [arrows, setArrows] = createSignal<Arrow[]>([]);

  const transform = (pt: Point) => {
    if (!svgRef) return;

    const svgPt = svgRef.createSVGPoint();
    svgPt.x = pt.x; 
    svgPt.y = pt.y;
  
    return svgPt.matrixTransform(svgRef.getScreenCTM()!.inverse());
  }

  const addEventListener = (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean): () => void => {
    svgRef?.addEventListener(name, handler, capture);

    return () => {
      svgRef?.removeEventListener(name, handler, capture);
    }
  }

  props.onInit({
    setEnabled
  });

  return (
    <svg 
      ref={svgRef}
      class={`a9s-arrows-layer ${styles.container}${enabled() ? ' enabled': ''}`}>

      <ArrowTool 
        addEventListener={addEventListener}
        transform={transform} 
        onCreateArrow={arrow => setArrows(current => [...current, arrow])} />

      {arrows().map(arrow => (
        <SvgArrow start={arrow.start} end={arrow.end} />
      ))}
    </svg>
  )

}