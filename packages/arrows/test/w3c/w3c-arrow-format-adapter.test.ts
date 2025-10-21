import { describe, it, expect } from 'vitest';
import { dequal } from 'dequal/lite';
import { parseW3C, serializeW3C, W3CArrowLinkAnnotation, W3CArrowMetaAnnotation, W3CImageArrowFormat } from '../../src/w3c';

import {
  LINKED_INTERNAL_FORMAT,
  LINKED_W3C,
  PAYLOAD_LINKED_W3C,
  UNLINKED_INTERNAL_FORMAT,
  UNLINKED_W3C
} from './fixtures';
import { ArrowAnnotation, isArrowAnnotation } from '@/types';

describe('W3CImageArrowFormat', () => {

  it('should parse the unlinked sample annotation correctly', () => {
    const adapter = W3CImageArrowFormat('http://localhost:5173/test/640px-Hallstatt.jpg');
    const { parsed } = adapter.parse(UNLINKED_W3C);
    expect(dequal(parsed, UNLINKED_INTERNAL_FORMAT)).toBeTruthy();
  });

  it('should serialized the unlinked sample annotation correctly', () => {
    const adapter = W3CImageArrowFormat('http://localhost:5173/test/640px-Hallstatt.jpg');
    const serialized = adapter.serialize(UNLINKED_INTERNAL_FORMAT);
    expect(dequal(serialized, UNLINKED_W3C)).toBeTruthy();
  });

  it('should parse the linked sample annotation correctly', () => {
    const adapter = W3CImageArrowFormat('http://localhost:5173/test/640px-Hallstatt.jpg');
    const { parsed } = adapter.parse(LINKED_W3C);
    expect(dequal(parsed, LINKED_INTERNAL_FORMAT)).toBeTruthy();
  });

  it('should serialized the linked sample annotation correctly', () => {
    const adapter = W3CImageArrowFormat('http://localhost:5173/test/640px-Hallstatt.jpg');
    const serialized = adapter.serialize(LINKED_INTERNAL_FORMAT);
    expect(dequal(serialized, LINKED_W3C)).toBeTruthy();
  });

  it('should parse the tag payload sample correctly', () => {
    const adapter = W3CImageArrowFormat('http://localhost:5173/test/640px-Hallstatt.jpg');

    // W3C uses pairs of annotations for tags - the internal model doesn't
    const { parsed } = adapter.parseAll([
      PAYLOAD_LINKED_W3C,
      LINKED_W3C
    ]);

    expect(parsed.length).toBe(1);
    expect(isArrowAnnotation(parsed[0])).toBeTruthy();
    
    const arrow = parsed[0] as ArrowAnnotation;
    
    expect(arrow.motivation).toBe('pointing');
    expect(dequal(arrow.target, LINKED_INTERNAL_FORMAT.target)).toBeTruthy();
    
    expect(arrow.bodies.length).toBe(1);
    expect(arrow.bodies[0].value).toBe('seeAlso');
  });

  it('should serialize the tag payload sample correctly', () => {
    const arrow: ArrowAnnotation = {
      ...LINKED_INTERNAL_FORMAT,
      bodies: [{
        id: '3eacd57d-ed01-4b53-a763-35edab001091',
        annotation: LINKED_INTERNAL_FORMAT.id,
        purpose: 'tagging',
        value: 'closeMatch'
      }]
    };

    const adapter = W3CImageArrowFormat('http://localhost:5173/test/640px-Hallstatt.jpg');
    const serialized = adapter.serialize(arrow);

    expect(Array.isArray(serialized)).toBeTruthy();
    expect(serialized.length).toBe(2);

    const [link, meta] = serialized as [W3CArrowLinkAnnotation, W3CArrowMetaAnnotation];

    expect(dequal(link, LINKED_W3C)).toBeTruthy();

    expect(meta.motivation).toBe('tagging');
    expect(meta.target).toBe(LINKED_INTERNAL_FORMAT.id);
    expect(Array.isArray(meta.body)).toBeTruthy();
    expect(meta.body.length).toBe(1);
    expect(meta.body[0].value).toBe('closeMatch');
  });

});