# Draggable

Draggable uses the JavaScript to provide draggable functionality to HTML elements.

## Design & API Documentation

- [Demos](https://dnd.lukaszrembacz.pl/examples/)

## Installation

```
npm install @dnd/draggable
```

## Usage

Draggable element can be used for different functionalities - from moving elements around to make sortable list or draggable grid elements.

### CSS Classes (they can be changed)

CSS Class | Description
--- | ---
`draggable--dragging` | Sets this class to element when dragging
`draggable--occurring` | Sets this class to body element when dragging

### `Draggable`

The `Draggable` JavaScript component allows for programmatic turn on / off the draggabillity to element.

```javascript
const draggableElement = document.querySelector('.draggable');
const draggable = new Draggable(draggableElement);
```

You can also use `attachTo()` as an alias;

```javascript
Draggable.attachTo(document.querySelector('.draggable'));
```

Events | Type | Data | Description
--- | --- | --- | ---
`onDragStart` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when dragging starts
`onDrag` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when dragging
`onDragEnd` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when dragging ends
    
Property | Value Type | Description
--- | --- | ---
`data` | Generic Type | Data which is attached to draggable
`draggable` | Boolean | Turn on / off draggable functionality
`avatar` | Avatar | Element which is rendered when element is dragging
`axis` | Axis ('both', 'horizontal', 'vertical') | Axis the dragging is available for
`handle` | String | Selector on which dragging is available (children of element are included)
`cancel` | String | Selectors on which draggins is not available (children of element are included)
`draggingClass` | String | Class which is set on element when dragging (`draggable--dragging` default)
`draggingClassBody` | String | Class which is set on body element when dragging (`draggable--occurring` default)
`minDragStartDistance` | number | Min distance to start dragStart state (`4` default)

Method Signature | Description
--- | ---
`abort() => void` | Proxies to the foundation's `abort` method
`destroy() => void` | Proxies to the foundation's `destroy` method

### `DraggableFoundation`

Method Signature | Description
--- | ---
| `abort() => void` | Abort current draggable. |
| `destroy() => void` | Destroy all event listeners and clean up component. |
