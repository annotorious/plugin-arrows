import { ArrowAnnotation } from '@/types';
import { W3CArrowLinkAnnotation, W3CArrowMetaAnnotation } from '@/w3c';

export const UNLINKED_INTERNAL_FORMAT: ArrowAnnotation = {
  id: '44b05e76-a379-4c39-8a94-e4e522a66213',
  motivation: 'pointing',
  bodies: [],
  target: {
    annotation: '44b05e76-a379-4c39-8a94-e4e522a66213',
    selector: {
      start: {
        x: 39.2,
        y: 206.2
      },
      end: {
        x: 131,
        y: 106.1
      }
    }
  }
};

export const LINKED_INTERNAL_FORMAT: ArrowAnnotation = {
  id: '18f62168-c9df-4b22-a689-2abe7ab64bcf',
  motivation: 'pointing',
  bodies: [],
  target: {
    annotation: '18f62168-c9df-4b22-a689-2abe7ab64bcf',
    selector: {
      start: {
        annotationId: '617d04b3-1f49-4b65-b684-5e64d90f10be',
        offset: {
          x: -6.1,
          y: 28.3
        }
      },
      end: {
        annotationId: 'e4309c1c-7481-4554-88a3-9ae42166ea5e',
        offset: {
          x: -9.5,
          y: 20.8
        }
      }
    }
  }
};

export const UNLINKED_W3C: W3CArrowLinkAnnotation = {
  id: '44b05e76-a379-4c39-8a94-e4e522a66213',
  motivation: 'linking',
  body: {
    source: "http://localhost:5173/test/640px-Hallstatt.jpg",
    type: 'Image',
    selector: {
      type: 'FragmentSelector',
      conformsTo: 'http://www.w3.org/TR/media-frags/',
      value: 'xywh=39.2,206.2,0,0'
    }
  },
  target: {
    source: "http://localhost:5173/test/640px-Hallstatt.jpg",
    type: 'Image',
    selector: {
      type: 'FragmentSelector',
      conformsTo: 'http://www.w3.org/TR/media-frags/',
      value: 'xywh=131,106.1,0,0'
    }
  }
};

export const LINKED_W3C: W3CArrowLinkAnnotation = {
  id: '18f62168-c9df-4b22-a689-2abe7ab64bcf',
  motivation: 'linking',
  body: {
    source: '617d04b3-1f49-4b65-b684-5e64d90f10be',
    type: 'Annotation',
    selector: {
      type: 'FragmentSelector',
      conformsTo: 'http://www.w3.org/TR/media-frags/',
      value: 'xywh=-6.1,28.3,0,0'
    }
  },
  target: {
    source: 'e4309c1c-7481-4554-88a3-9ae42166ea5e',
    type: 'Annotation',
    selector: {
      type: 'FragmentSelector',
      conformsTo: 'http://www.w3.org/TR/media-frags/',
      value: 'xywh=-9.5,20.8,0,0'
    }
  }
};

export const PAYLOAD_LINKED_W3C: W3CArrowMetaAnnotation = {
  id: '817269a0-9b6e-45cb-884e-20d8fa09dbb1',
  motivation: 'tagging',
  body: {
    value: 'seeAlso'
  },
  target: '18f62168-c9df-4b22-a689-2abe7ab64bcf'
}