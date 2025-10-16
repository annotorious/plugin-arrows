import { render } from 'solid-js/web';
import type { ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';
import { ImageArrowsLayer, ArrowsLayerAPI } from '@/components';
import { createConnectionGraph } from '@/state';
import { AnnotatorInstanceState, ArrowsPluginInstance, ArrowsPluginMode } from '@/types';

export const mountImagePlugin = (anno: ImageAnnotator<ImageAnnotation>): ArrowsPluginInstance => {

  const state = anno.state as AnnotatorInstanceState;

  // Needed to keep arrows in sync if connected annotations 
  // are deleted!
  const graph = createConnectionGraph(state.store);

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
    graph.destroy();
    dispose();
  }

  return {
    setEnabled,
    setMode,
    unmount
  }

}