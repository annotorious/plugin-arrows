import clsx from 'clsx';
import { type ImageAnnotation, ShapeType } from '@annotorious/annotorious';
import { SvgEmphasisRectangle } from './svg-emphasis-rectangle';
import { SvgEmphasisPolygon } from './svg-emphasis-polygon';
import { SvgEmphasisEllipse } from './svg-emphasis-ellipse';

import styles from './svg-emphasis.module.css';
import { SvgEmphasisPolyline } from './svg-emphasis-polyline';
import { SvgEmphasisMultiPolygon } from './svg-emphasis-multipolygon';

interface SvgEmphasisProps {

  style: 'start' | 'end';

  annotation: ImageAnnotation;

}

export const SvgEmphasis = (props: SvgEmphasisProps) => {

  const { type } = props.annotation.target.selector;

  return (
    <g class={clsx('a9s-arrow-tool-emphasis', styles.container)}>
      {type === ShapeType.RECTANGLE ? (
        <SvgEmphasisRectangle 
          annotation={props.annotation} />
      ) : type === ShapeType.POLYGON ? (
        <SvgEmphasisPolygon 
          annotation={props.annotation} />
      ) : type === ShapeType.ELLIPSE ? (
        <SvgEmphasisEllipse 
          annotation={props.annotation} />
      ) : type === ShapeType.POLYLINE ? (
        <SvgEmphasisPolyline
          annotation={props.annotation} />
      ) : type === ShapeType.MULTIPOLYGON ? (
        <SvgEmphasisMultiPolygon
          annotation={props.annotation} />
      ) : null}
    </g>
  )

}