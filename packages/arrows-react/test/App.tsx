import { useEffect, useState } from 'react';
import { ImageAnnotator } from '@annotorious/react';
import { ArrowsPlugin } from '../src';

export const App = () => {

  const [mode, setMode] = useState<'ANNOTATE' | 'ARROWS'>('ANNOTATE');

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(mode === 'ARROWS');
  }, [mode]);

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