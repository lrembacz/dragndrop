const cssClasses = {
    DRAGGING_CLASS: 'draggable--dragging',
    DRAGGING_BODY_CLASS: 'draggable--occurring',
};

const strings = {
    CUSTOM_DRAG_ENTER: '_customDragEnter',
    CUSTOM_DRAG_OVER: '_customDragOver',
    CUSTOM_DRAG_LEAVE: '_customDragLeave',
    CUSTOM_DROP: '_customDrop',
    CANCEL_STRING: 'input, textarea, button, select, option',
    SHADOW_DOM_RETARGET_ATTRIBUTE: 'draggable-retarget',
    DRAG_START_EVENT: 'onDragStart',
    DRAG_EVENT: 'onDrag',
    DRAG_END_EVENT: 'onDragEnd',

};

const numbers = {
    MIN_DRAG_START_DISTANCE: 4,
};

export {cssClasses, strings, numbers};
