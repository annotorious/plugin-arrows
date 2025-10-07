import { useCallback, useEffect, useState } from 'react';
import { AnnotoriousOpenSeadragonAnnotator, AnnotoriousPlugin, useViewer } from '@annotorious/react';
import { ArrowsPluginInstance, mountOSDPlugin as _mountPlugin } from '@annotorious/plugin-arrows';

interface OSDArrowsPluginProps {

  enabled?: boolean;

}

export const OSDArrowsPlugin = (props: OSDArrowsPluginProps) => {

  const viewer = useViewer();
  
  const [instance, setInstance] = useState<ArrowsPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousOpenSeadragonAnnotator) => {
    if (!viewer) return;
    const { enabled: _, ...opts } = props;
    return _mountPlugin(anno, viewer);
  }, [viewer]);

  useEffect(() => {
    if (instance) instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  return (
    <AnnotoriousPlugin
      plugin={mountPlugin} 
      onLoad={instance => setInstance(instance as ArrowsPluginInstance)} />
  )

}