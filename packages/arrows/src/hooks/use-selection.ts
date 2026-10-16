import { createSignal, onCleanup, onMount } from 'solid-js';
import type { Annotation, Selection, SelectionState } from '@annotorious/annotorious';

export const useSelection = <I extends Annotation, E extends unknown>(
  selection: SelectionState<I, E>
) => {

  const [selected, setSelected] = createSignal<Selection>({ selected: selection.selected });

  onMount(() => {
    const unsubscribeSelection = selection.subscribe((selection: Selection) =>
      setSelected(selection));

    onCleanup(() => {
      unsubscribeSelection();
    })
  });

  return selected;

}