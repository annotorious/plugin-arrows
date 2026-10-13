import { render } from 'solid-js/web';
import type { JSX } from 'solid-js';

/**
 * Like Solid's `render`, but into a dedicated wrapper element appended to
 * `parent`. Solid's `render` clears the entire mount element on dispose
 * (`textContent = ''`) - when that is the annotator or OpenSeadragon viewer
 * element, unmounting the plugin would also remove the annotator/viewer
 * content. Disposing this only removes the wrapper.
 */
export const renderLayer = (code: () => JSX.Element, parent: HTMLElement) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'a9s-arrows-layer-wrapper';
  parent.appendChild(wrapper);

  const dispose = render(code, wrapper);

  return () => {
    dispose();
    wrapper.remove();
  }
}
