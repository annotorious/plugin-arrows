import React from 'react';
import { createRoot } from 'react-dom/client';
import { Annotorious } from '@annotorious/react';
import { App } from './app';

import '@annotorious/react/annotorious-react.css';

const root = createRoot(document.getElementById('root') as Element);
root.render(
  <React.StrictMode>
    <Annotorious>
      <App />
    </Annotorious>
  </React.StrictMode>
);