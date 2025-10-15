import type { ReactNode } from 'react';
import type { FloatingArrowProps } from '@floating-ui/react';
import type { ArrowPopupProps } from '../arrow-popup-props';

interface OSDArrowPopupProps {

  arrow?: boolean;

  arrowProps?: Omit<FloatingArrowProps, 'context' | 'ref'> & { padding?: number };

  popup(props: ArrowPopupProps): ReactNode;

}

const OSDArrowPopup = (props: OSDArrowPopupProps) => {

  return null;

}