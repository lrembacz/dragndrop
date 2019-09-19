# dnd

Dnd is main package for @dnd. It wraps all of elements inside and gives them in one place.

## Examples

- [Demos](https://dnd.lukaszrembacz.pl/examples/)


## Installation

```
npm install @dnd/dnd
```

## Usage

```javascript
import * as dnd from '@dnd/dnd';
const draggable = dnd.draggable.Draggable.attachTo(document.querySelector('.draggable'));
// OR
import {dropzone} from '@dnd/dnd';
const dropzone = dropzone.Dropzone(document.querySelector('.dropzone'));
```

Check all components [here](https://github.com/lrembacz/dnd/tree/master/packages).