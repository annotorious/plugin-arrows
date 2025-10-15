import type { AnnotationBody } from '@annotorious/react';
import type { ArrowAnnotation } from '@annotorious/plugin-arrows';

export interface ArrowPopupProps {

  annotation: ArrowAnnotation;

  onCreateBody(body: Partial<AnnotationBody>): void;

  onDeleteBody(id: string): void;

  onUpdateBody(current: Partial<AnnotationBody>, next: Partial<AnnotationBody>): void;
  
}