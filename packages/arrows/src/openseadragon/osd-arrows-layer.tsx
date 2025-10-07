import OpenSeadragon from 'openseadragon';
import { ArrowsLayer, ArrowsLayerAPI } from '@/arrows-layer';
import { Point } from '@/types';

interface OpenSeadragonArrowsLayerProps {

  viewer: OpenSeadragon.Viewer;

  onInit(api: ArrowsLayerAPI): void;

}

export const OpenSeadragonArrowsLayer = (props: OpenSeadragonArrowsLayerProps) => {

  const elementToImage = (svg?: SVGSVGElement) => (pt: Point) =>
    props.viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(pt.x, pt.y));

  const addEventListener = (svg?: SVGSVGElement) => (
    name: keyof SVGSVGElementEventMap, 
    handler: (evt: Event) => void, 
    capture?: boolean
  ): () => void => {
    svg?.addEventListener(name, handler, capture);

    return () => {
      svg?.removeEventListener(name, handler, capture);
    }
  }

  return (
    <ArrowsLayer
      onInit={props.onInit}
      elementToImage={elementToImage}
      addEventListener={addEventListener} />
  )

}