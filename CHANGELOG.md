# Change Log

# [0.0.2] Fix for chrome - TouchEvent + PointerEvent

- There was a problem when both PointerEvent and TouchEvent was available in browser.
- Fixed with preventDefault on `touchstart` handler

# [0.0.1] Initial commit - First version