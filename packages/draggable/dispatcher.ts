/// Dispatches [MouseEvent]s for dragEnter, dragOver, and dragLeave.
///
/// Those events are only meant for communication between [Draggable]s and
/// [Dropzone]s and not to be consumed by users of the library.
import {DraggableFoundation} from './foundation';

export class _DragEventDispatcher {
    /// Keeps track of the previous target to be able to fire dragLeave events on it.
    static previousTarget: EventTarget;

    /// Dispatches dragEnter, dragOver, and dragLeave events.
    ///
    /// The [draggable] is the [Draggable] that is dispatching the event.
    /// The [target] is the element that the event will be dispatched on.
    static dispatchEnterOverLeave<D>(draggableFoundation: DraggableFoundation<D>, target: EventTarget): void {

        // Sometimes the target is null (e.g. when user drags over buttons on
        // android). Ignore it.
        if (target == null) {
            return;
        }

        if (this.previousTarget === target) {
            // Moved on the same element --> dispatch dragOver.
            const dragOverEvent: MouseEvent = new MouseEvent(DraggableFoundation.strings.CUSTOM_DRAG_OVER, {bubbles: true});
            (dragOverEvent as any).data = {
                currentDrag: draggableFoundation.getAdapter().getCurrentDrag()
            };
            // const dragOverEvent: CustomEvent = new CustomEvent(DraggableFoundation.strings.CUSTOM_DRAG_OVER);
            target.dispatchEvent(dragOverEvent);
        } else {
            // Entered a new element --> fire dragEnter of new element.
            const dragEnterEvent: MouseEvent = new MouseEvent(DraggableFoundation.strings.CUSTOM_DRAG_ENTER, {relatedTarget: this.previousTarget, bubbles: true});
            (dragEnterEvent as any).data = {
                currentDrag: draggableFoundation.getAdapter().getCurrentDrag()
            };
            // const dragEnterEvent: CustomEvent = new CustomEvent(DraggableFoundation.strings.CUSTOM_DRAG_ENTER, dragEnterEventInit);
            target.dispatchEvent(dragEnterEvent);

            // Fire dragLeave of old element (if there is one).
            if (this.previousTarget != null) {

                const dragLeaveEvent: MouseEvent = new MouseEvent(DraggableFoundation.strings.CUSTOM_DRAG_LEAVE, {relatedTarget: target, bubbles: true});
                (dragLeaveEvent as any).data = {
                    currentDrag: draggableFoundation.getAdapter().getCurrentDrag()
                };
                // const dragLeaveEvent: CustomEvent = new CustomEvent(DraggableFoundation.strings.CUSTOM_DRAG_LEAVE);
                this.previousTarget.dispatchEvent(dragLeaveEvent);
            }

            // Also fire the first dragOver event for the new element.
            const dragOverEvent: MouseEvent = new MouseEvent(DraggableFoundation.strings.CUSTOM_DRAG_OVER, {bubbles: true});
            (dragOverEvent as any).data = {
                currentDrag: draggableFoundation.getAdapter().getCurrentDrag()
            };
            // const dragOverEvent: CustomEvent = new CustomEvent(DraggableFoundation.strings.CUSTOM_DRAG_OVER);
            target.dispatchEvent(dragOverEvent);

            this.previousTarget = target;
        }
    }

    /// Dispatches drop event.
    ///
    /// The [draggable] is the [Draggable] that is dispatching the event.
    /// The [target] is the element that the event will be dispatched on.
    static dispatchDrop<D>(draggableFoundation: DraggableFoundation<D>, target: EventTarget): void {
        // Sometimes the target is null (e.g. when user drags over buttons on
        // android). Ignore it.
        if (target == null) {
            return;
        }

        const dropEvent: MouseEvent = new MouseEvent(DraggableFoundation.strings.CUSTOM_DROP, {bubbles: true});
        (dropEvent as any).data = {
            currentDrag: draggableFoundation.getAdapter().getCurrentDrag()
        };
        // const dropEvent: CustomEvent = new CustomEvent(DraggableFoundation.strings.CUSTOM_DROP);
        target.dispatchEvent(dropEvent);

        this.reset(draggableFoundation);
    }

    /// Must be called when drag ended to fire a last dragLeave event.
    static reset<D>(draggableFoundation: DraggableFoundation<D>): void {
        // Fire a last dragLeave.
        if (this.previousTarget != null) {
            const dragLeaveEvent: MouseEvent = new MouseEvent(DraggableFoundation.strings.CUSTOM_DRAG_LEAVE, {bubbles: true});
            (dragLeaveEvent as any).data = {
                currentDrag: draggableFoundation.getAdapter().getCurrentDrag()
            };
            // const dragLeaveEvent: CustomEvent = new CustomEvent(DraggableFoundation.strings.CUSTOM_DRAG_LEAVE);
            this.previousTarget.dispatchEvent(dragLeaveEvent);
            this.previousTarget = null;
        }
    }
}