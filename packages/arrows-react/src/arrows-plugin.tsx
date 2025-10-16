import { useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { mountImagePlugin as _mountPlugin } from '@annotorious/plugin-arrows';
import type { ArrowsPluginInstance, ArrowsPluginMode, ArrowsPluginOptions } from '@annotorious/plugin-arrows';

interface ArrowsPluginProps extends ArrowsPluginOptions {

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
    instance?.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  useEffect(() => {
    instance?.setMode(props.mode);
  }, [instance, props.mode]);

  useEffect(() => {
    instance?.setVisibility(props.showArrows);
  }, [instance, props.showArrows]);
  
  return (
    <AnnotoriousPlugin
      plugin={mountPlugin} 
      onLoad={instance => setInstance(instance as ArrowsPluginInstance)} /> 
  )

}