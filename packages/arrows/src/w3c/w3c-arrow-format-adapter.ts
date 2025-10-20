import { v5 as uuidv5 } from 'uuid';
import { parseFragmentSelector, W3CImageFormat } from '@annotorious/annotorious';
import { isArrowAnchor, isArrowAnnotation } from '@/types';
import type {ArrowAnnotation, AnnotatorInstanceAnnotation, ArrowAnchor, Point } from '@/types';
import { isW3CArrowLinkAnnotation, isW3CArrowMetaAnnotation } from './w3c-arrow-annotation';
import type { W3CArrowLinkEdge, W3CArrowLinkAnnotation, W3CArrowMetaAnnotation } from './w3c-arrow-annotation';
import type { 
  FormatAdapter, 
  ParseResult,
  W3CAnnotationBody, 
  W3CImageAnnotation, 
  W3CImageFormatAdapter, 
  W3CImageFormatAdapterOpts
} from '@annotorious/annotorious';

// Shorthand 
type W3CAnnotationOrArrow = 
  W3CImageAnnotation | W3CArrowLinkAnnotation | [W3CArrowLinkAnnotation, W3CArrowMetaAnnotation];

// Internal model to W3C
export type W3CArrowFormatAdapter = FormatAdapter<AnnotatorInstanceAnnotation, W3CAnnotationOrArrow>;

export const W3CImageArrowFormat = (
  source: string,
  opts: W3CImageFormatAdapterOpts = { strict: true, invertY: false }
): W3CArrowFormatAdapter => {
  const imageAdapter = W3CImageFormat(source, {...opts, strict: false });

  const parse = (serialized: W3CAnnotationOrArrow) => parseW3C(serialized, imageAdapter);

  const parseAll = (serialized: (W3CImageAnnotation | W3CArrowLinkAnnotation | W3CArrowMetaAnnotation)[]) => {
    const metaAnnotations = serialized.filter(a => isW3CArrowMetaAnnotation(a));

    const otherAnnotations = serialized.filter(a => 
      !isW3CArrowMetaAnnotation(a)) as (W3CImageAnnotation | W3CArrowLinkAnnotation)[];

    // Pair a link annotation with its meta annotation, if possible
    const pair = (link: W3CArrowLinkAnnotation): W3CArrowLinkAnnotation | [W3CArrowLinkAnnotation, W3CArrowMetaAnnotation] => {
      const meta = metaAnnotations.find(a => a.target === link.id);
      return meta ? [link, meta] : link;
    } 

    return otherAnnotations.reduce((result, next) => {
      const { parsed, error } = isW3CArrowLinkAnnotation(next)
        ? parse(pair(next))
        : parse(next);

      return error ? {
        parsed: result.parsed,
        failed: [...result.failed, next ]
      } : parsed ? {
        parsed: [...result.parsed, parsed ],
        failed: result.failed
      } : {
        ...result
      }
    }, { parsed: [] as AnnotatorInstanceAnnotation[], failed: [] as any[]});
  }

  const serialize = (annotation: AnnotatorInstanceAnnotation) =>
    serializeW3C(annotation, imageAdapter, source);

  return { parse, parseAll, serialize }
}

export const parseW3C = (
  arg: W3CAnnotationOrArrow,
  imageAdapter: W3CImageFormatAdapter
): ParseResult<AnnotatorInstanceAnnotation> => {

  const parseArrowEdge = (arg: W3CArrowLinkEdge): Point | ArrowAnchor => {
    const rect = parseFragmentSelector(arg.selector);

    if (arg.type === 'Annotation') {
      return {
        annotationId: arg.source,
        offset: { x: rect.geometry.x, y: rect.geometry.y }
      };
    } else {
      return { x: rect.geometry.x, y: rect.geometry.y };
    }
  }

  const parseArrow = (arg: W3CArrowLinkAnnotation, meta?: W3CArrowMetaAnnotation): ArrowAnnotation => ({
    id: arg.id,
    motivation: 'pointing',
    bodies: meta 
      ? Array.isArray(meta.body) ? meta.body : [meta.body]
      : [],
    target: {
      annotation: arg.id,
      selector: {
        start: parseArrowEdge(arg.body),
        end: parseArrowEdge(arg.target)
      }
    }
  });

  if (Array.isArray(arg)) {
    const [link, meta] = arg;
    const parsed = parseArrow(link, meta);
    return { parsed };
  } else if (isW3CArrowLinkAnnotation(arg)) {
    const parsed = parseArrow(arg);
    return { parsed };
  } else {
    return imageAdapter.parse(arg)
  }
}

export const serializeW3C = (
  annotation: AnnotatorInstanceAnnotation, 
  imageAdapter: W3CImageFormatAdapter, 
  source: string
): W3CImageAnnotation | W3CArrowLinkAnnotation | [W3CArrowLinkAnnotation, W3CArrowMetaAnnotation] => {
  if (isArrowAnnotation(annotation)) {
    const { id, bodies, target: { selector: { start, end }} } = annotation;

    const serializeArrowEdge = (arg: Point | ArrowAnchor): W3CArrowLinkEdge => {
      if (isArrowAnchor(arg)) {
        return {
          source: arg.annotationId,
          type: 'Annotation',
          selector: {
            type: 'FragmentSelector',
            conformsTo: 'http://www.w3.org/TR/media-frags/',
            value: `xywh=${arg.offset.x},${arg.offset.y},0,0`
          }
        }
      } else {
        return {
          source,
          type: 'Image',
          selector: {
            type: 'FragmentSelector',
            conformsTo: 'http://www.w3.org/TR/media-frags/',
            value: `xywh=${arg.x},${arg.y},0,0`
          }
        }
      }
    } 

    const link = { 
      id,
      motivation: 'linking',
      body: serializeArrowEdge(start),
      target: serializeArrowEdge(end)
    } as W3CArrowLinkAnnotation;

    if (bodies.length > 0) {
      // Here's a key problem: each annotation needs a stable ID. However, the "meta annotation"
      // does not exist in the internal model. (Meta payload is just stored as bodies.) Therefore,
      // we're deriving a UUID from the annotation UUID, and use that for the meta annotation.
      const meta = {
        id: uuidv5('@annotorious/plugin-connectors', id),
        motivation: 'tagging',
        body: bodies.map(b => ({
          purpose: b.purpose,
          value: b.value
        } as W3CAnnotationBody)),
        target: id
      } as W3CArrowMetaAnnotation;

      return [link, meta];
    } else {
      return link;
    }
  } else {
    return imageAdapter.serialize(annotation)
  }
}