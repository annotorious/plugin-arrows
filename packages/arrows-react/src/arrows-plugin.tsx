import { useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { ArrowsPluginInstance, mountImagePlugin as _mountPlugin } from '@annotorious/plugin-arrows';

interface ArrowsPluginProps {

  enabled?: boolean;

}

export const ArrowsPlugin = (props: ArrowsPluginProps) => {

  const [instance, setInstance] = useState<ArrowsPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousImageAnnotator) => {
    const { enabled: _, ...opts } = props;
    return _mountPlugin(anno);
  }, []);

  useEffect(() => {
    if (instance)
      instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);
  
  return (
    <AnnotoriousPlugin
      plugin={mountPlugin} 
      onLoad={instance => setInstance(instance as ArrowsPluginInstance)} /> 
  )

}