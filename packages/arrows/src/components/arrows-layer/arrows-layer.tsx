import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import clsx from 'clsx';
import type { Filter } from '@annotorious/annotorious';
import type { User } from '@annotorious/annotorious';
import { ArrowEditor } from '@/components/arrow-editor';
import { ArrowTool } from '@/components/arrow-tool';
import { useArrows, useHover, useSelection } from '@/hooks';
import { ArrowsLayerAPI } from './arrows-layer-api';
import { SvgArrow } from './svg-arrow';
import { ArrowsVisibility, isArrowAnchor, isArrowAnnotation } from '@/types';
import type {
  AnnotatorInstanceState, 
  ArrowAnnotation, 
  ArrowsPluginMode, 
  ArrowsPluginOptions,
  Point 
} from '@/types';

import styles from './arrows-layer.module.css';

export interface ArrowsLayerProps {

  addEventListener(svg?: SVGSVGElement): (name: keyof SVGSVGElementEventMap, handler: (evt: Event) => void, capture?: boolean) => () => void;
  
  class?: string;

  elementToImage(svg?: SVGSVGElement): (pt: Point) => Point;

  getUser?(): User;

  options: ArrowsPluginOptions;

  scale?: number;
    
  state: AnnotatorInstanceState;

  transform?: string;
  
  onInit(api: ArrowsLayerAPI): void;

  onHover(hovered?: ArrowAnnotation): void;

}

export const ArrowsLayer = (props: ArrowsLayerProps) => {

  let svgRef: SVGSVGElement | undefined;

  const [enabled, setEnabled] = createSignal(true);

  const [mode, setMode] = createSignal<ArrowsPluginMode>('select');

  const [visibility, setVisibility] = createSignal<ArrowsVisibility | undefined>(props.options.showArrows);

  // NOTE: since the filter itself will be a function, and Solid treates
  // functions passed to setters as specifically "functions to update a value
  // based on the previous value", calls to setFilter need to be wrapped
  const [filter, setFilter] = createSignal<Filter<ArrowAnnotation> | undefined>(props.options.filter);

  const { store, selection } = props.state;

  const allArrows = useArrows(store);

  const arrows = createMemo(() => {
    const f = filter();
    return f ? allArrows().filter(f) : allArrows();
  });

  const selected = useSelection(selection);

  // Automatically tracks hover through Annotorious when the arrows-layer is `pointer-events: none`
  const [hoveredImageAnnotation, setHoveredImageAnnotation] = useHover(props.state);

  const visibleArrows = createMemo(() => {
    const showArrows = visibility() || 'ALWAYS';
  
    if (showArrows === 'ALWAYS') {
      return arrows();
    } else {
      const selectedIds = selected().selected.map(s => s.id);

      const hovered = hoveredImageAnnotation();

      const activeIds: string[] = 
        showArrows === 'HOVER_ONLY' ? (hovered?.id ? [hovered?.id] : []) :
        showArrows === 'SELECTED_ONLY' ? selectedIds :
        [...selectedIds, ...(hovered?.id ? [hovered?.id] : [])];

      return arrows().filter(c => {
        const { start, end } = c.target.selector;

        return activeIds.includes(c.id) ||
          (isArrowAnchor(start) && activeIds.includes(start.annotationId)) ||
          (isArrowAnchor(end) && activeIds.includes(end.annotationId));
      });
    }
  });

  const isSelected = (arrow: ArrowAnnotation) =>
    selected().selected?.some(s => s.id === arrow.id);

  const editedArrow = createMemo(() => {
    const editableIds = selected().selected
      .filter(s => s.editable)
      .map(s => s.id);

    return arrows().find(a => editableIds.includes(a.id));
  });

  props.onInit({
    get isEnabled() {
      return enabled();
    },
    setEnabled,
    setFilter: (filter?: Filter<ArrowAnnotation>) => setFilter(() => filter),
    setMode,
    setVisibility
  });

  const onClickedArrow = (arrow: ArrowAnnotation, evt: MouseEvent) => 
    selection.userSelect(arrow.id, evt as PointerEvent);

  const onPointerUp = (evt: PointerEvent) => {
    if (!enabled() || mode() === 'draw') return;

    if (evt.target !== svgRef) return;
  }

  const onPointerMove = (evt: PointerEvent) => {
    const pt = props.elementToImage(svgRef)({ x: evt.offsetX, y: evt.offsetY });
    const hovered = store.getAt(pt.x, pt.y);

    if (!isArrowAnnotation(hovered))
      setHoveredImageAnnotation(hovered);
  }

  createEffect(() => {
    if (mode() === 'draw') {
      selection.clear();
      setHoveredImageAnnotation();
    }
  });

  const onCreateArrow = (arrow: ArrowAnnotation) => {
    // Like Annotorious does for shapes, stamp the current user as creator
    const creator = props.getUser?.();
    store.addAnnotation(creator 
      ? { ...arrow, target: { ...arrow.target, creator } } 
      : arrow);
    setHoveredImageAnnotation(undefined);
  }

  return (
    <svg 
      ref={svgRef}
      class={clsx(
        'a9s-arrows-layer', 
        props.class, 
        styles.container, 
        enabled() && 'enabled',
        mode()
      )}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}>
      <g transform={props.transform}>
        {mode() === 'draw' && (
          <ArrowTool
            addEventListener={props.addEventListener(svgRef)}
            hovered={hoveredImageAnnotation()}
            state={props.state}
            transform={props.elementToImage(svgRef)} 
            viewportScale={props.scale}
            onCreateArrow={onCreateArrow} />
        )}

        <For each={visibleArrows()}>
          {arrow => (
            <Show 
              when={editedArrow()?.id !== arrow.id}>
              <SvgArrow
                class={isSelected(arrow) ? 'a9s-arrow-selected' : undefined}
                state={props.state}
                start={arrow.target.selector.start} 
                end={arrow.target.selector.end} 
                viewportScale={props.scale} 
                onClick={evt => onClickedArrow(arrow, evt)} 
                onHover={hovered => hovered ? props.onHover(arrow) : props.onHover()} />
            </Show>
          )}
        </For>

        <Show when={editedArrow()}>
          {arrow => (
            <ArrowEditor 
              arrow={arrow()} 
              state={props.state}
              transform={props.elementToImage(svgRef)} 
              viewportScale={props.scale} />
          )}
        </Show>
      </g>
    </svg>
  )

}