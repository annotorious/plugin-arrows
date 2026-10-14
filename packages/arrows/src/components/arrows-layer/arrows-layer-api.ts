import type { Filter } from '@annotorious/annotorious';
import { ArrowAnnotation, ArrowsPluginMode, ArrowsVisibility } from '@/types';

export interface ArrowsLayerAPI {

  isEnabled: boolean;

  setEnabled(enabled: boolean): void;

  setFilter(filter?: Filter<ArrowAnnotation>): void;

  setMode(mode: ArrowsPluginMode): void;

  setVisibility(visibility?: ArrowsVisibility): void;

}
