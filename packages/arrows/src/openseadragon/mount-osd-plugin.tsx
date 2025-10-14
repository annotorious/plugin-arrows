import { render } from 'solid-js/web';
import OpenSeadragon from 'openseadragon';
import type { ImageAnnotation, ImageAnnotationStore } from '@annotorious/annotorious';
import { OpenSeadragonAnnotator } from '@annotorious/openseadragon';
import { ArrowsLayerAPI } from '@/arrows-layer';
import { createArrowSelection, createArrowStore, createLifecycleObserver } from '@/state';
import { AnnotatorInstanceState, ArrowsPluginInstance, ArrowsPluginMode } from '@/types';
import { OpenSeadragonArrowsLayer } from './osd-arrows-layer';

export const mountOSDPlugin = (anno: OpenSeadragonAnnotator, viewer: OpenSeadragon.Viewer): ArrowsPluginInstance => {

  const store = createArrowStore();

  const selection = createArrowSelection(store);

  const lifecycle = createLifecycleObserver(store, selection);

  const state = anno.state as AnnotatorInstanceState;
  
  let componentAPI: ArrowsLayerAPI |  null = null;

  let dispose = () => {};

  let wasDisposed = false;

  // Note that Annotorious OSD may take longer to initialize than the
  // plugin! Ensure that everything is properly set up before we init the
  // wires layer, because it will attach listeners to the annotation layer!
  const mountOSDArrowsLayer = (retries = 10) => {
    const isReady = Boolean(viewer.element);
    if (isReady) {
      // In case the plugin was disposed while waiting for retry
      if (wasDisposed) return;

      dispose = render(() => (
        <OpenSeadragonArrowsLayer 
          onInit={api => componentAPI = api} 
          state={state}
          viewer={viewer} />
      ), viewer.element);
    } else if (retries > 0) {
      setTimeout(() => mountOSDArrowsLayer(retries - 1), 100)
    } else {
      throw new Error('Failed to initialize Annotorious Arrows plugin: no annotation layer')
    }
  }

  mountOSDArrowsLayer();

  /** API **/

  const setEnabled = (enabled: boolean) => {
    if (enabled && anno.getSelected().length > 0)
      anno.cancelSelected();

    componentAPI?.setEnabled(enabled);
  }

  const setMode = (mode: ArrowsPluginMode) => {
    componentAPI?.setMode(mode);

    if (componentAPI?.isEnabled) {
      viewer.setMouseNavEnabled(mode === 'select');

      if (mode === 'draw')
        anno.cancelSelected();
    }
  }
  
  const unmount = () => {
    wasDisposed = true;
    dispose();
  }

  return { 
    on: lifecycle.on,
    setEnabled,
    setMode,
    unmount
  }

}