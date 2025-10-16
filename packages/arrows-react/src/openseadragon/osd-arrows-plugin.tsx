import { useEffect, useState } from 'react';
import { AnnotoriousOpenSeadragonAnnotator, useAnnotator, useViewer } from '@annotorious/react';
import { mountOSDPlugin as _mountPlugin } from '@annotorious/plugin-arrows';
import type { ArrowsPluginInstance, ArrowsPluginMode, ArrowsPluginOptions } from '@annotorious/plugin-arrows';

import '@annotorious/plugin-arrows/annotorious-arrows.css';

interface OSDArrowsPluginProps extends ArrowsPluginOptions {

  enabled?: boolean;

  mode?: ArrowsPluginMode;

}

export const OSDArrowsPlugin = (props: OSDArrowsPluginProps) => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const viewer = useViewer();
  
  const [instance, setInstance] = useState<ArrowsPluginInstance>();

  useEffect(() => {
    if (!anno || !viewer) return;

    const { enabled: _, ...opts } = props;
    const instance = _mountPlugin(anno, viewer);

    setInstance(instance);

    return () => {
      instance.unmount();
    }
  }, [anno, viewer]);

  useEffect(() => {
    instance?.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  useEffect(() => {
    instance?.setMode(props.mode);
  }, [instance, props.mode]);

  useEffect(() => {
    instance?.setVisibility(props.showArrows);
  }, [instance, props.showArrows]);

  return null;

}