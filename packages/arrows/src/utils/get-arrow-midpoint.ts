import { getArrow } from 'perfect-arrows';
import type { Store } from '@annotorious/annotorious';
import type { AnnotatorInstanceAnnotation, ArrowAnnotation, Point } from '@/types';
import { getAnchorPoint } from './get-anchor-point';

export const getArrowMidpoint = (
  store: Store<AnnotatorInstanceAnnotation>, 
  arrow: ArrowAnnotation, 
  viewportScale = 1
): Point => {
  const { start, end } = arrow.target.selector;

  const startPoint = getAnchorPoint(store, start);
  const endPoint = getAnchorPoint(store, end);

  const { x: x0, y: y0 } = startPoint;
  const { x: x1, y: y1 } = endPoint;
  
  const [sx, sy, cx, cy, ex, ey] = getArrow(x0, y0, x1, y1, {
      stretch: 0.25,
      stretchMax: Infinity,
      padEnd: 12 / viewportScale
    });
  
  const t = 0.5;
  const u = 1 - t;
  
  // Quadratic Bézier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
  const x = u * u * sx + 2 * u * t * cx + t * t * ex;
  const y = u * u * sy + 2 * u * t * cy + t * t * ey;
  
  return { x, y };  
}