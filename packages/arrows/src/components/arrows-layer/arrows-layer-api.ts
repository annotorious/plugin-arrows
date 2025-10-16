import { ArrowsPluginMode, ArrowsVisibility } from '@/types';

export interface ArrowsLayerAPI {

  isEnabled: boolean;

  setEnabled(enabled: boolean): void;

  setMode(mode: ArrowsPluginMode): void;

  setVisibility(visibility?: ArrowsVisibility): void;

}
