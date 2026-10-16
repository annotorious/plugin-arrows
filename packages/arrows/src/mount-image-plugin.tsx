import type { Filter, ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';
import { ImageArrowsLayer, ArrowsLayerAPI } from '@/components';
import { createConnectionGraph, createHoverStateBridge } from '@/state';
import { renderLayer } from '@/render-layer';
import { 
  AnnotatorInstanceState, 
  ArrowAnnotation,
  ArrowsPluginInstance, 
  ArrowsPluginMode, 
  ArrowsPluginOptions, 
  ArrowsVisibility 
} from '@/types';

export const mountImagePlugin = (
  anno: ImageAnnotator<ImageAnnotation>,
  options: ArrowsPluginOptions = {}
): ArrowsPluginInstance => {

  const state = anno.state as AnnotatorInstanceState;

  // Needed to keep arrows in sync if connected annotations 
  // are deleted!
  const graph = createConnectionGraph(state.store);

  // This patches arrow mouseEnter/-Leave events into Annotorious
  const hovered = createHoverStateBridge(state);

  let componentAPI: ArrowsLayerAPI |  null = null;

  const dispose = renderLayer(() => 
    <ImageArrowsLayer 
      getUser={anno.getUser}
      options={options}
      state={state}
      onInit={api => componentAPI = api} 
      onHover={hovered.set} />
  , anno.element);

  /** API **/

  const setEnabled = (enabled: boolean) =>
    componentAPI?.setEnabled(enabled);

  const setFilter = (filter?: Filter<ArrowAnnotation>) =>
    componentAPI?.setFilter(filter);

  const setMode = (mode: ArrowsPluginMode) =>
    componentAPI?.setMode(mode);

  const setVisibility = (visibility?: ArrowsVisibility) =>
    componentAPI?.setVisibility(visibility);
  
  const unmount = () => {
    graph.destroy();
    dispose();
  }

  return {
    setEnabled,
    setFilter,
    setMode,
    setVisibility,
    unmount
  }

}