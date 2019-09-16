/// Event used when a drag is detected.
import {DragInfo} from './drag-info';

export class DraggableEvent<D> {
    /// The [DragInfo] that is beeing dragged.
    dragInfo: DragInfo<D>;

    /// The original event which is either ...
    /// * a [MouseEvent],
    /// * a [TouchEvent],
    /// * a [KeyboardEvent] when the user clicks the esc-key,
    /// * a normal [Event] when the window loses focus (blur event), or
    /// * null if the drag was programmatically aborted.
    originalEvent: Event;

    /// Indicates if this [DraggableEvent] was [cancelled]. This is currently
    /// only used for [onDragEnd] events to indicate a drag end through a
    /// cancelling oparation like `esc` key or windows loosing focus.
    cancelled: boolean;

    /// Private constructor for [DraggableEvent].
    private constructor(originalEvent: Event, dragInfo: DragInfo<D>, cancelled = false) {
        this.originalEvent = originalEvent;
        this.dragInfo = dragInfo;
        this.cancelled = cancelled;
    }

    static create<D>(originalEvent: Event, dragInfo: DragInfo<D>, cancelled = false) {
        return new DraggableEvent(originalEvent, dragInfo, cancelled);
    }

    public toObject() {
        return {
            originalEvent: this.originalEvent,
            dragInfo: this.dragInfo,
            cancelled: this.cancelled
        };
    }
}