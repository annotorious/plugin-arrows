import { useEffect, useState } from 'react';
import { AnnotoriousOpenSeadragonAnnotator, useAnnotator, useViewer } from '@annotorious/react';
import { ArrowsPluginInstance, mountOSDPlugin as _mountPlugin } from '@annotorious/plugin-arrows';

import '@annotorious/plugin-arrows/annotorious-arrows.css';

interface OSDArrowsPluginProps {

  enabled?: boolean;

}

export const OSDArrowsPlugin = (props: OSDArrowsPluginProps) => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const viewer = useViewer();
  
  const [instance, setInstance] = useState<ArrowsPluginInstance>();

  useEffect(() => {
    if (!anno || !viewer) return;

    const tracker = Math.random();

    const { enabled: _, ...opts } = props;
    const instance = _mountPlugin(anno, viewer);

    setInstance(instance);

    return () => {
      instance.unmount();
    }
  }, [anno, viewer]);

  useEffect(() => {
    if (instance) instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  return null;

}