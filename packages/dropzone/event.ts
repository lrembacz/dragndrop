/// Event for dropzone elements.
import {DragInfo} from '@dnd/draggable/drag-info';

export class DropzoneEvent<D> {
    /// The [Element] of the [Dropzone].
    dropzoneElement: Element;

    /// [DragInfo] snapped to draggable
    dragInfo: DragInfo<D>;

    event: Event;

    private constructor(dragInfo: DragInfo<D>, dropzoneElement: Element, event: Event) {
        this.dragInfo = dragInfo;
        this.dropzoneElement = dropzoneElement;
        this.event = event;
    }

    static create<D>(dragInfo: DragInfo<D>, dropzoneElement: Element, event: Event) {
        return new DropzoneEvent(dragInfo, dropzoneElement, event);
    }

    toObject() {
        return {
            dropzoneElement: this.dropzoneElement,
            dragInfo: this.dragInfo,
            event: this.event
        };
    }
}