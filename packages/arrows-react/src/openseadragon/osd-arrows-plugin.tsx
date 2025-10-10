import { useEffect, useRef, useState } from 'react';
import { AnnotoriousOpenSeadragonAnnotator, useAnnotator, useViewer } from '@annotorious/react';
import { Arrow, ArrowsPluginInstance, ArrowsPluginMode, mountOSDPlugin as _mountPlugin } from '@annotorious/plugin-arrows';

import '@annotorious/plugin-arrows/annotorious-arrows.css';

interface OSDArrowsPluginProps {

  enabled?: boolean;

  mode?: ArrowsPluginMode;

  onCreate?(arrow: Arrow): void;

  onSelect?(arrow?: Arrow): void;

}

export const OSDArrowsPlugin = (props: OSDArrowsPluginProps) => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const viewer = useViewer();
  
  const [instance, setInstance] = useState<ArrowsPluginInstance>();

  const onCreateRef = useRef(props.onCreate);
  const onSelectRef = useRef(props.onSelect);

  useEffect(() => { onCreateRef.current = props.onCreate; }, [props.onCreate]);

  useEffect(() => {
    if (!anno || !viewer) return;

    const { enabled: _, ...opts } = props;
    const instance = _mountPlugin(anno, viewer);

    instance.on('createArrow', arrow => onCreateRef.current?.(arrow));
    instance.on('selectArrow', arrow => onSelectRef.current?.(arrow));

    setInstance(instance);

    return () => {
      instance.unmount();
    }
  }, [anno, viewer]);

  useEffect(() => {
    if (instance) instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  useEffect(() => {
    if (instance) instance.setMode(props.mode);
  }, [instance, props.mode]);

  return null;

}