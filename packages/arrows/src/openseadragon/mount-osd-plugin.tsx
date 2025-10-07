import { render } from 'solid-js/web';
import OpenSeadragon from 'openseadragon';
import { OpenSeadragonAnnotator } from '@annotorious/openseadragon';
import { ArrowsLayerAPI } from '@/arrows-layer';
import { OpenSeadragonArrowsLayer } from './osd-arrows-layer';

export const mountOSDPlugin = (anno: OpenSeadragonAnnotator, viewer: OpenSeadragon.Viewer) => {

  let componentAPI: ArrowsLayerAPI |  null = null;

  const dispose = render(() => (
    <OpenSeadragonArrowsLayer onInit={api => componentAPI = api} viewer={anno.viewer} />
  ), anno.viewer.element);

  /** API **/

  const setEnabled = (enabled: boolean) => {
    if (enabled && anno.getSelected().length > 0)
      anno.cancelSelected();

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