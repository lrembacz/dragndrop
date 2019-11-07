# Change Log

# [0.1.2] Fix to polyfills

# [0.1.0] New `exact` property added to Dropzone component + elementRoot is on DropzoneAdapter + Draggable changes
- `exact` makes stopPropagation() on events from Draggable to prevent form bubbling on parents
- new method is added on DropzoneAdapter `getRootElement()` provides way to get element 
- additionally there are `addClass`, `hasClass` and `removeClass` methods added to DropzoneAdapter
- `Draggable` gets another property: `touchAction` - sets style to touch-action when element starts drag
- moved setting noTouch to new method from constructor to allow to change behavior on previously created `Draggable`
- Added `customScroll` property to `Draggable` - allows to specify way to handle customScrolling when using drag on touch devices
- Added polyfills to work on IE11
- Added `shift` to dragInfo

# [0.0.2] Fix for chrome - TouchEvent + PointerEvent

- There was a problem when both PointerEvent and TouchEvent was available in browser.
- Fixed with preventDefault on `touchstart` handler

# [0.0.1] Initial commit - First version