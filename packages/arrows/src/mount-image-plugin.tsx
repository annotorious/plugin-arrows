import { render } from 'solid-js/web';
import type { ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';
import { ImageArrowsLayer, ArrowsLayerAPI } from './arrows-layer';
import { ArrowsPluginInstance } from './types';

export const mountImagePlugin = (anno: ImageAnnotator<ImageAnnotation>): ArrowsPluginInstance => {

  let componentAPI: ArrowsLayerAPI |  null = null;

  const dispose = render(() => <ImageArrowsLayer onInit={api => componentAPI = api} />, anno.element);

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