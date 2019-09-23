# Change Log

# [0.1.0] New `exact` property added to Dropzone component + elementRoot is on DropzoneAdapter
- makes stopPropagation() on events from Draggable to prevent form bubbling on parents
- new method is added on DropzoneAdapter `getRootElement()` provides way to get element 
- additionally there are `addClass`, `hasClass` and `removeClass` methods added to DropzoneAdapter.

# [0.0.2] Fix for chrome - TouchEvent + PointerEvent

- There was a problem when both PointerEvent and TouchEvent was available in browser.
- Fixed with preventDefault on `touchstart` handler

# [0.0.1] Initial commit - First version