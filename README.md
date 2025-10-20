# Annotorious Arrows Plugin

An Annotorious plugin for drawing arrows. Arrows can be independent annotations, or they can be linked to existing shapes — either on both ends, or on one end only (start or tip). When linked, the relationships are represented in the data model.

Also available: [React wrapper](packages/arrows-react)

## Installation

```
npm install @annotorious/plugin-arrows
```

## Usage

### With Images (JPEG, PNG)

```
import { createImageAnnotator } from '@annotorious/annotorious';
import { mountImagePlugin } from '@annotorious/plugin-arrows';

const anno = createImageAnnotator('sample-image');

const arrowsPlugin = mountImagePlugin(anno, {
  // Plugin options (see below)
});
```

### With OpenSeadragon

```
import { createOSDAnnotator } from '@annotorious/openseadragon';
import { mountOSDPlugin } from '@annotorious/plugin-arrows';

const viewer = OpenSeadragon({
  // OSD init options
});

const anno = createOSDAnnotator(viewer, {
  // Annotorious init options
});

const arrowsPlugin = mountOSDPlugin(anno, viewer, {
  // Plugin options (see below)
});
```

### Usage

Once installed, the plugin integrates seamlessly with the Annotorious lifecycle. Arrow annotations trigger the same events as other annotations:
  - `createAnnotation`
  - `updateAnnotation`
  - `deleteAnnotation`
  - `selectionChanged`
  - `mouseEnterAnnotation`
  - `mouseLeaveAnnotation`

> [!NOTE]
> `clickAnnotation` and `viewportIntersect` are **currently not supported** for arrows.

By default, the plugin starts **enabled** and in **select** mode:
- You can interact with all annotations normally (regular shapes and arrows).
- Clicking an arrow selects it, allowing the user to move it or adjust the start/tip.

To let users **draw arrows**, switch to draw mode:

```js
arrowsPlugin.setMode('draw');
```

Users can then:
- Click once for the start and once for the end point, or
- Click and drag from start to end. 

### Plugin Options

| Option | Type | Description |
|--------|------|-------------|
| `showArrows` | `ArrowsVisibility` | Controls when arrows are visible |

`ArrowsVisibility` can be one of the following: 
- `ALWAYS` – all arrows are visible.
- `HOVER_ONLY` – arrows appear only when hovering over a connected shape annotation.
- `SELECTED_ONLY` – arrows appear only when a connected annotation is selected.
- `HOVER_OR_SELECT` – arrows appear when hovering over or selecting a connected annotation.

### Plugin API

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setEnabled(enabled: boolean)` | `true`/`false` | Enables or disables the plugin (arrows remain visible) |
| `setMode(mode: 'draw' | 'select')` | – | Switches between drawing and selection modes. |
| `setVisibility(visibility: ArrowsVisibility)` | –  | Changes arrow visibility. |
| `unmount()` | – | Cleans up and destroys the plugin instance. |

## Data Model

Arrow annotations differ from standard Annotorious shapes in two ways:
- They have a `motivation` field with the value `pointing`. 
- Their target represents the arrow **start** and **end** anchors.

An arrow can be **independent**, with explicit start/end coordinates, or **linked** to existing annotations.

**Example: independent (unlinked) arrow**

```json
{
  "id": "aab6d162-0156-461e-b3cd-704ee5061d89",
  "motivation": "pointing",
  "bodies": [],
  "target": {
    "created": "2025-10-20T13:16:56.486Z",
    "selector": {
      "start": { "x": 37.4, "y": 176.6 },
      "end": { "x": 120.3, "y": 80.1 }
    }
  }
}
```

**Example: arrow linked at both ends**

```json
{
  "id": "daf0e68a-002b-44fd-9b9c-6c984c992742",
  "motivation": "pointing",
  "bodies": [],
  "target": {
    "created": "2025-10-20T13:18:26.019Z",
    "selector": {
      "start": {
        "annotationId": "617d04b3-1f49-4b65-b684-5e64d90f10be",
        "offset": { "x": -2, "y": 108.8 }
      },
      "end": {
        "annotationId": "e4309c1c-7481-4554-88a3-9ae42166ea5e",
        "offset": { "x": -13, "y": 0.1 }
      }
    }
  }
}
```

Linked anchors (start or end) reference other annotations by ID. The `offset` represents the **X/Y offset from the center of the linked shape's bounding box**, rather than absolute image coordinates. 

## License

[BSD-3-Clause](LICENSE)