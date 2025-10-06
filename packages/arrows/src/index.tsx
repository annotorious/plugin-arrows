import { render } from 'solid-js/web';
import { ArrowsLayer } from './arrows-layer';
import type { ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';

export interface ArrowsPluginInstance {

  unmount(): void;

}

export const mountPlugin = (anno: ImageAnnotator<ImageAnnotation>): ArrowsPluginInstance => {

  console.log('rendering arrow layer into', anno.element);
  
  const dispose = render(() => <ArrowsLayer />, anno.element);

  /*
  const connectorLayer = new WiresLayer({
    target: anno.element,
    props: {
      opts,
      enabled: isEnabled,
      graph,
      state: anno.state as ImageAnnotatorState<ImageAnnotation | ConnectionAnnotation>
    }
  });
  */

  /** API **/
  
  const unmount = () => {
    dispose();
  }

  return { 
    unmount
  }

}