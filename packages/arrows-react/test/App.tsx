import { useEffect, useState } from 'react';
import { Annotation, Annotator, ImageAnnotator, useAnnotator } from '@annotorious/react';
import { ArrowsPlugin } from '../src';

export const App = () => {

  const [mode, setMode] = useState<'ANNOTATE' | 'ARROWS'>('ANNOTATE');

  const [enabled, setEnabled] = useState(false);

  const anno = useAnnotator<Annotator<Annotation, Annotation>>();

  useEffect(() => {
    if (mode === 'ARROWS') setEnabled(true);
  }, [mode]);

  useEffect(() => {
    
  }, [anno]);

  return (
    <div id="content">
      <div>
        <button onClick={() => setMode(mode => mode === 'ANNOTATE' ? 'ARROWS' : 'ANNOTATE')}>
          {mode === 'ANNOTATE' ? 'Annotate' : 'Arrows'}
        </button>
      </div>

      <ImageAnnotator>
        <img src="640px-Hallstatt.jpg" />
      </ImageAnnotator>

      <ArrowsPlugin 
        enabled={enabled}>
      </ArrowsPlugin>
    </div>
  )

}