import { render } from 'solid-js/web';
import type { ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';
import { ImageArrowsLayer, ArrowsLayerAPI } from './arrows-layer';
import { createArrowStore, createArrowSelection } from './state';
import { ArrowsPluginInstance, ArrowsPluginMode } from './types';

export const mountImagePlugin = (anno: ImageAnnotator<ImageAnnotation>): ArrowsPluginInstance => {

  const store = createArrowStore();

  const selection = createArrowSelection(store);

  const state = { store, selection };

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
    on: store.on,
    setEnabled,
    setMode,
    unmount
  }

}