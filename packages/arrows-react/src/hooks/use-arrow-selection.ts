import { useEffect, useMemo, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { Store, useAnnotationStore, useSelection } from '@annotorious/react';
import { getArrowMidpoint, isArrowAnnotation } from '@annotorious/plugin-arrows';
import type { AnnotatorInstanceAnnotation, ArrowAnnotation, Point } from '@annotorious/plugin-arrows';

export interface ArrowSelection {

  arrow?: ArrowAnnotation;

  editable?: boolean;

  midpoint?: Point;

  event?: Event;

}

export const useArrowSelection = (viewer?: OpenSeadragon.Viewer) => {

  const [scale, setScale] = useState(1);

  const store = useAnnotationStore<Store<AnnotatorInstanceAnnotation>>();

  const selection = useSelection<AnnotatorInstanceAnnotation>();

  const arrowSelection: ArrowSelection = useMemo(() => {
    const { selected, event } = selection;
    
    const selectedArrows = selected.filter(({ annotation }) => isArrowAnnotation(annotation));
    if (selectedArrows.length > 0) {
      const { editable } = selectedArrows[0];
      const arrow = selectedArrows[0].annotation as ArrowAnnotation;
      const midpoint = getArrowMidpoint(store, arrow, scale);
      return { arrow, editable, midpoint, event };
    } else {
      return {};
    }
  }, [selection, scale]);

  useEffect(() => {
    if (!viewer) return;

    const onUpdateViewport = () => {
      const containerWidth = viewer.viewport.getContainerSize().x;
      const zoom = viewer.viewport.getZoom(true);
      setScale(zoom * containerWidth / viewer.world.getContentFactor());
    }

    viewer.addHandler('update-viewport', onUpdateViewport);

    return () => {
      viewer.removeHandler('update-viewport', onUpdateViewport);
    }
  }, [viewer]);

  return arrowSelection;

}