import { AnnotatorInstanceState, ArrowsPluginOptions, Point } from '@/types';
import { ArrowsLayerAPI } from './arrows-layer-api';
import { ArrowsLayer } from './arrows-layer';

interface ImageArrowsLayerProps {

  options: ArrowsPluginOptions;

  state: AnnotatorInstanceState;

  onInit(api: ArrowsLayerAPI): void;

}

export const ImageArrowsLayer = (props: ImageArrowsLayerProps) => {

  const elementToImage = (svg: SVGSVGElement) => (pt: Point) => {
    if (!svg) return;

    const svgPt = svg.createSVGPoint();
    svgPt.x = pt.x; 
    svgPt.y = pt.y;
  
    return svgPt.matrixTransform(svg.getCTM()!.inverse());
  }

  const addEventListener = (svg: SVGSVGElement) => (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean): () => void => {
    svg?.addEventListener(name, handler, capture);

    return () => {
      svg?.removeEventListener(name, handler, capture);
    }
  }

  return (
    <ArrowsLayer
      addEventListener={addEventListener}
      elementToImage={elementToImage}
      options={props.options}
      state={props.state}
      onInit={props.onInit} />
  )

}