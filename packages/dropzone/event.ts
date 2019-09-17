/// Event for dropzone elements.
import {DragInfo} from '@dnd/draggable/drag-info';

export class DropzoneEvent<D> {
    /// The [Element] of the [Dropzone].
    dropzoneElement: Element;

    /// [DragInfo] snapped to draggable
    dragInfo: DragInfo<D>;

    originalEvent: Event;

    private constructor(originalEvent: Event, dragInfo: DragInfo<D>, dropzoneElement: Element) {
        this.originalEvent = originalEvent;
        this.dragInfo = dragInfo;
        this.dropzoneElement = dropzoneElement;
    }

    static create<D>(originalEvent: Event, dragInfo: DragInfo<D>, dropzoneElement: Element) {
        return new DropzoneEvent(originalEvent, dragInfo, dropzoneElement);
    }

    toObject() {
        return {
            originalEvent: this.originalEvent,
            dropzoneElement: this.dropzoneElement,
            dragInfo: this.dragInfo,
        };
    }
}