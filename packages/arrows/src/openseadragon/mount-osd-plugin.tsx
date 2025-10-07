import { render } from 'solid-js/web';
import OpenSeadragon from 'openseadragon';
import { OpenSeadragonAnnotator } from '@annotorious/openseadragon';
import { ArrowsLayerAPI } from '@/arrows-layer';
import { OpenSeadragonArrowsLayer } from './osd-arrows-layer';

export const mountOSDPlugin = (anno: OpenSeadragonAnnotator, viewer: OpenSeadragon.Viewer) => {

  let componentAPI: ArrowsLayerAPI |  null = null;

  let dispose = () => {};

  let wasDisposed = false;

  // Note that Annotorious OSD may take longer to initialize than the
  // plugin! Ensure that everything is properly set up before we init the
  // wires layer, because it will attach listeners to the annotation layer!
  const mountOSDArrowsLayer = (retries = 10) => {
    const isReady = Boolean(viewer.element.querySelector('.a9s-gl-canvas'));
    if (isReady) {
      // In case the plugin was desposed while waiting for retry
      if (wasDisposed) return;

      dispose = render(() => (
        <OpenSeadragonArrowsLayer onInit={api => componentAPI = api} viewer={viewer} />
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
  
  const unmount = () => {
    wasDisposed = true;
    dispose();
  }

  return { 
    setEnabled,
    unmount
  }

}