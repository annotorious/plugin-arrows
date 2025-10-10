import { createMemo, Match, Switch } from 'solid-js';
import clsx from 'clsx';
import { type ImageAnnotation, ShapeType } from '@annotorious/annotorious';
import { SvgEmphasisRectangle } from './svg-emphasis-rectangle';
import { SvgEmphasisPolygon } from './svg-emphasis-polygon';
import { SvgEmphasisEllipse } from './svg-emphasis-ellipse';
import { SvgEmphasisPolyline } from './svg-emphasis-polyline';
import { SvgEmphasisMultiPolygon } from './svg-emphasis-multipolygon';

import styles from './svg-emphasis.module.css';

interface SvgEmphasisProps {

  style: 'start' | 'end';

  annotation: ImageAnnotation;

}

export const SvgEmphasis = (props: SvgEmphasisProps) => {

  const type = createMemo(() => props.annotation.target.selector.type);

  return (
    <g class={clsx('a9s-arrow-tool-emphasis', styles.container)}>
      <Switch>
        <Match when={type() === ShapeType.RECTANGLE}>
          <SvgEmphasisRectangle annotation={props.annotation} />
        </Match>

        <Match when={type() === ShapeType.POLYGON}>
          <SvgEmphasisPolygon annotation={props.annotation} />
        </Match>

        <Match when={type() === ShapeType.ELLIPSE}>
          <SvgEmphasisEllipse annotation={props.annotation} />
        </Match>

        <Match when={type() === ShapeType.POLYLINE}>
          <SvgEmphasisPolyline annotation={props.annotation} />
        </Match>
        
        <Match when={type() === ShapeType.MULTIPOLYGON}>
          <SvgEmphasisMultiPolygon annotation={props.annotation} />
        </Match>
      </Switch>
    </g>
  )

}