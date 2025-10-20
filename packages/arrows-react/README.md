# Annotorious Arrows Plugin (React)

A React wrapper for the Annotorious Arrows Plugin, providing React components for easy integration with both image and OpenSeadragon annotators.

## Installation

```
npm install @annotorious/plugin-arrows-react
```

## Quick Start (Images)

```tsx
import { useState } from 'react';
import { ImageAnnotator } from '@annotorious/annotorious';
import { ArrowsPlugin } from '@annotorious/plugin-arrows-react';

import '@annotorious/annotorious/annotorious.css';
import '@annotorious/plugin-arrows/annotorious-arrows.css';

export const App = () => {
  const [mode, setMode] = useState<'draw' | 'select'>('select');

  return (
    <div>
      <div>
        <button onClick={() => setMode(mode => mode === 'select' ? 'draw' : 'select')}>
          Mode: {mode}
        </button>
      </div>

      <ImageAnnotator>
        <img src="640px-Hallstatt.jpg" alt="Sample" />
      </ImageAnnotator>

      <ArrowsPlugin mode={mode} />
    </div>
  )

}
```

## Quick Start (OpenSeadragon)

For OpenSeadragon, use the `OSDArrowsPlugin`component together with `OpenSeadragonAnnotator` from `@annotorious/react`.

```tsx
import { useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { OpenSeadragonAnnotator, OpenSeadragonViewer } from '@annotorious/react';
import { OSDArrowsPlugin } from '@annotorious/plugin-arrows-react';

import '@annotorious/openseadragon/annotorious-openseadragon.css';
import '@annotorious/plugin-arrows/annotorious-arrows.css';

const OSD_OPTIONS: OpenSeadragon.Options = {
  // OpenSeadragon options
};

export const App = () => {
  const [mode, setMode] = useState<'select' | 'draw'>('select');

  return (
    <div>
      <div className="buttons">
        <button onClick={() => setMode(mode => mode === 'select' ? 'draw' : 'select')}>
          Mode: {mode}
        </button>
      </div>

      <OpenSeadragonAnnotator>
        <OpenSeadragonViewer options={OSD_OPTIONS} />

        <OSDArrowsPlugin mode={mode} />
      </OpenSeadragonAnnotator>
    </div>
  )

}
```

## Selection Popup

You can attach a custom selection popup with the `OSDArrowPopup` helper component.

```tsx
import { OSDArrowsPlugin, OSDArrowPopup } from '@annotorious/plugin-arrows-react';

<OpenSeadragonAnnotator>
  <OpenSeadragonViewer options={OSD_OPTIONS} />

  <OSDArrowsPlugin mode={mode} />

  <OSDArrowPopup 
    popup={props => <div>My custom popup</div>} 
  />
</OpenSeadragonAnnotator>

```