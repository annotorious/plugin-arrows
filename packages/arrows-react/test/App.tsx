import { useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, ImageAnnotator, useAnnotator } from '@annotorious/react';
import { ArrowsPlugin } from '../src';

export const App = () => {

  const [mode, setMode] = useState<'ANNOTATE' | 'ARROWS'>('ANNOTATE');

  const [enabled, setEnabled] = useState(false);

  const anno = useAnnotator<AnnotoriousImageAnnotator>();

  useEffect(() => {
    setEnabled(mode === 'ARROWS');
  }, [mode]);

  const onDelete = () => {
    if (!anno) return;

    const imageAnnotations = anno.getAnnotations().filter(a => !('motivation' in a));
    if (imageAnnotations.length > 0)
      anno.removeAnnotation(imageAnnotations[imageAnnotations.length - 1]);
  }

  return (
    <div id="content">
      <div>
        <button onClick={() => setMode(mode => mode === 'ANNOTATE' ? 'ARROWS' : 'ANNOTATE')}>
          {mode === 'ANNOTATE' ? 'Annotate' : 'Arrows'}
        </button>
        <button onClick={onDelete}>
          Delete
        </button>
      </div>

      <ImageAnnotator>
        <img src="640px-Hallstatt.jpg" />
      </ImageAnnotator>

      <ArrowsPlugin 
        enabled={true}
        mode={enabled ? 'draw' : 'select'}>
      </ArrowsPlugin>
    </div>
  )

}