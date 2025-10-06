import { render } from 'solid-js/web';
import { ArrowsLayer, ArrowsLayerAPI } from './arrows-layer/arrows-layer';
import type { ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';

export interface ArrowsPluginInstance {

  setEnabled(enabled: boolean): void;

  unmount(): void;

}

export const mountPlugin = (anno: ImageAnnotator<ImageAnnotation>): ArrowsPluginInstance => {

  let componentAPI: ArrowsLayerAPI |  null = null;

  const dispose = render(() => <ArrowsLayer onInit={api => componentAPI = api} />, anno.element);

  /** API **/

  const setEnabled = (enabled: boolean) => {
    componentAPI?.setEnabled(enabled);
  }
  
  const unmount = () => {
    dispose();
  }

  return { 
    setEnabled,
    unmount
  }

}