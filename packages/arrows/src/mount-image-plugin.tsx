import { render } from 'solid-js/web';
import type { ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';
import { ImageArrowsLayer, ArrowsLayerAPI } from './arrows-layer';
import { AnnotatorInstanceState, ArrowsPluginInstance, ArrowsPluginMode } from './types';

export const mountImagePlugin = (anno: ImageAnnotator<ImageAnnotation>): ArrowsPluginInstance => {

  const state = anno.state as AnnotatorInstanceState;

  let componentAPI: ArrowsLayerAPI |  null = null;

  const dispose = render(() => 
    <ImageArrowsLayer 
      state={state}
      onInit={api => componentAPI = api} />
  , anno.element);

  /** API **/

  const setEnabled = (enabled: boolean) =>
    componentAPI?.setEnabled(enabled);

  const setMode = (mode: ArrowsPluginMode) =>
    componentAPI?.setMode(mode);
  
  const unmount = () => {
    dispose();
  }

  return {
    setEnabled,
    setMode,
    unmount
  }

}