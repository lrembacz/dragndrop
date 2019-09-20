# Drag`n drop

Dragndrop is main package for @dragndrop. It wraps all of elements inside and gives them in one place.

## Examples

- [Demos](https://dragndrop.lukaszrembacz.pl/examples/)


## Installation

```
npm install @dragndrop/dragndrop
```

## Usage

```javascript
import * as dragndrop from '@dragndrop/dragndrop';
const draggable = dragndrop.draggable.Draggable.attachTo(document.querySelector('.draggable'));
// OR
import {dropzone} from '@dragndrop/dragndrop';
const dropzone = dropzone.Dropzone(document.querySelector('.dropzone'));
```

Check all components [here](https://github.com/lrembacz/dragndrop/tree/master/packages).