import { createSignal, onCleanup, onMount } from 'solid-js';
import { Selection, SelectionState } from '@annotorious/annotorious';
import { AnnotatorInstanceAnnotation } from '@/types';

export const useSelection = (selection: SelectionState<AnnotatorInstanceAnnotation, AnnotatorInstanceAnnotation>) => {

  const [selected, setSelected] = createSignal<Selection>({ selected: selection.selected });

  onMount(() => {
    const unsubscribeSelection = selection.subscribe(({ selected }) => setSelected(selected));

    onCleanup(() => {
      unsubscribeSelection();
    })
  });

  return selected;

}