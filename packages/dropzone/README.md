# Dropzone

Dropzone is element which `Draggable` element can be dropped on.

## Design & API Documentation

- [Demos](https://dragndrop.lukaszrembacz.pl/examples/)

## Installation

```
npm install @dragndrop/dropzone
```

## Usage

Dropzone element can be used in common with Draggable element to create variety of drag and drop powered components for websites.

### CSS Classes (they can be changed)

CSS Class | Description
--- | ---
`dragging--over` | Sets this class to element when draggable element is draggedOver the dropzone
`dragging--invalid` | Sets this class to element when draggable element is not accepted by dropzone

### `Dropzone`

The `Dropzone` is a component which accept `Draggables` and allow them to be dropped. 

```javascript
const dropzoneElement = document.querySelector('.dropzone');
const dropzone = new Dropzone(dropzoneElement);
```

You can also use `attachTo()` as an alias;

```javascript
Dropzone.attachTo(document.querySelector('.dropzone'));
```

Events | Type | Data | Description
--- | --- | --- | ---
`onDragEnter` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when `Draggable` enters on `Dropzone`
`onDragLeave` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when `Draggable` leaves on `Dropzone`
`onDragOver` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when `Draggable` is over on `Dropzone`
`onDrop` | CustomEvent | {originalEvent, dragInfo, dropzoneElement} | Event dispatched when `Draggable` is dropped on `Dropzone`

Property | Value Type | Description
--- | --- | ---
`acceptor` | Acceptor | Data which is attached to draggable
`exact` | boolean | Events from Draggable are stopped with stopPropagation() when exact is true.
`overClass` | String | Class which is set on element when draggingOver (`dragging--over` default)
`invalidClass` | String | Class which is set on element when draggingOver not accepted element (`dragging--invalid` default)
`allowOnChild` | boolean | It allows to drop, if draggable is a child of dropzone, without dragging outside.

Method Signature | Description
--- | ---
`destroy() => void` | Proxies to the foundation's `destroy` method

### `DropzoneFoundation`

Method Signature | Description
--- | ---
| `destroy() => void` | Destroy all event listeners and clean up component. |

### `Acceptor`

Acceptor allows to provide instructions to dropzone which elements should be accepted and which should not.

When Element is not accepted it can`t be dropped on Dropzone.

```javascript
abstract accepts<D>(dragInfo: DragInfo<D>, dropzoneElement: Element, event: Event): boolean;
```

Acceptor is abstract class with accepts method which should be implemented.

Argument | Type | Description
--- | --- | ---
`dragInfo` | DragInfo<D> | Info from `Draggable` which is snapped when dragging
`dropzoneElement` | Element | Dropzone element on which element is dragged
`event` | CustomEvent | Custom Event dispatched `_customDragEnter`, `_customDragLeave`, `_customDragOver` and `_customDrop`

Default there is only `DraggablesAcceptor` implemented which is accepting given `Draggables`.

If you need you can write your own `Acceptor` for example QuerySelectorAcceptor to accept elements with given querySelectors. 
