/// Dispatches [MouseEvent]s for dragEnter, dragOver, and dragLeave.
///
/// Those events are only meant for communication between [Draggable]s and
/// [Dropzone]s and not to be consumed by users of the library.
import {DraggableFoundation} from './foundation';

export class _DragEventDispatcher {
    /// Keeps track of the previous target to be able to fire dragLeave events on it.
    static previousTarget: EventTarget = null;

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

        if (this.previousTarget == target) {
            // Moved on the same element --> dispatch dragOver.
            draggableFoundation.getAdapter().notifyTarget(
                target,
                DraggableFoundation.strings.CUSTOM_DRAG_OVER,
                {dragInfo: draggableFoundation.getAdapter().getCurrentDrag()},
                {bubbles: true}
            );
        } else {
            // Entered a new element --> fire dragEnter of new element.
            draggableFoundation.getAdapter().notifyTarget(
                target,
                DraggableFoundation.strings.CUSTOM_DRAG_ENTER,
                {dragInfo: draggableFoundation.getAdapter().getCurrentDrag()},
                {relatedTarget: this.previousTarget, bubbles: true}
            );

            // Fire dragLeave of old element (if there is one).
            if (this.previousTarget != null) {
                draggableFoundation.getAdapter().notifyTarget(
                    this.previousTarget,
                    DraggableFoundation.strings.CUSTOM_DRAG_LEAVE,
                    {dragInfo: draggableFoundation.getAdapter().getCurrentDrag()},
                    {relatedTarget: target, bubbles: true}
                );
            }

            // Also fire the first dragOver event for the new element.
            draggableFoundation.getAdapter().notifyTarget(
                target,
                DraggableFoundation.strings.CUSTOM_DRAG_OVER,
                {dragInfo: draggableFoundation.getAdapter().getCurrentDrag()},
                {bubbles: true}
            );
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
        draggableFoundation.getAdapter().notifyTarget(
            target,
            DraggableFoundation.strings.CUSTOM_DROP,
            {dragInfo: draggableFoundation.getAdapter().getCurrentDrag()},
            {bubbles: true}
        );
        this.reset(draggableFoundation);
    }

    /// Must be called when drag ended to fire a last dragLeave event.
    static reset<D>(draggableFoundation: DraggableFoundation<D>): void {
        // Fire a last dragLeave.
        if (this.previousTarget != null) {
            draggableFoundation.getAdapter().notifyTarget(
                this.previousTarget,
                DraggableFoundation.strings.CUSTOM_DRAG_LEAVE,
                {dragInfo: draggableFoundation.getAdapter().getCurrentDrag()},
                {bubbles: true}
            );
            this.previousTarget = null;
        }
    }
}