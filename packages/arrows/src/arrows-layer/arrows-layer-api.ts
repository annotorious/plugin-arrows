import { ArrowsPluginMode } from '@/types';

export interface ArrowsLayerAPI {

  setEnabled(enabled: boolean): void;

  setMode(mode: ArrowsPluginMode): void;

}
