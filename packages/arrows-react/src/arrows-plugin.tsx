import { useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { ArrowsPluginInstance, ArrowsPluginMode, mountImagePlugin as _mountPlugin } from '@annotorious/plugin-arrows';

interface ArrowsPluginProps {

  enabled?: boolean;

  mode?: ArrowsPluginMode;

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

  useEffect(() => {
    if (instance)
      instance.setMode(props.mode);
  }, [instance, props.mode]);
  
  return (
    <AnnotoriousPlugin
      plugin={mountPlugin} 
      onLoad={instance => setInstance(instance as ArrowsPluginInstance)} /> 
  )

}