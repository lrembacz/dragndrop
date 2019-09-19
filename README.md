# Drag and drop Components for the web

Drag and drop components provides simple API to handle drag and drop functionality for web applications.

Those components are using vanilla javascript and Material Components Base Component to make it easier to  adapt them into another frameworks.

Drag and drop components are written in Typescript and are 

> NOTE: Drag and drop components are a work in progress. There are possible some breaking changes. So use them with caution.

## Important links

- [Demos](https://dnd.lukaszrembacz.pl/examples/)
- [Components on other frameworks](docs/framework-wrappers.md)
- [All Components](packages/)
- [Changelog](./CHANGELOG.md)

## Quick start

### Using NPM

Install draggable node module to your project.

```
npm install @dnd/draggable
```

#### HTML

Sample usage of draggable component. Please see [Draggable](packages/draggable) component page for more options.

```html
<div class="draggable">
  <p>Drag me!</p>
</div>
```

#### JavaScript

Import `Draggable` module.

```js
import {Draggable} from '@dnd/draggable';
const draggable = new Draggable(document.querySelector('.draggable'));
```

It will create Draggable instance on `.draggable` class element.

## Thank you

Special thanks to:

- [Material components for web](https://github.com/material-components/material-components-web) for base components and configs.
- [dart-dnd](https://github.com/marcojakob/dart-dnd) as @dnd package is based on this package.
