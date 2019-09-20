/// An acceptor defines which draggable elements are accepted by a [Dropzone].

import {DragInfo} from '@dragndrop/draggable/drag-info';
import {DraggableInterface} from '@dragndrop/draggable/types';

export abstract class Acceptor {
    /// Returns true if the [draggableElement] with [draggableId] should be
    /// accepted by the [dropzoneElement].
    abstract accepts<D>(dragInfo: DragInfo<D>, dropzoneElement: Element, event: Event): boolean;

}

/// The [DraggablesAcceptor] accepts all drag elements that are part of the
/// specified list of [Draggable]s.
export class DraggablesAcceptor extends Acceptor {
        draggableIds: Set<number> = new Set();

    constructor(draggables: Array<DraggableInterface>) {
        super();
        draggables.forEach((d) => {
            this.draggableIds.add(d._id);
        });
    }

    accepts<D>(dragInfo: DragInfo<D>, dropzoneElement: Element, event: Event): boolean {
        return this.draggableIds.has(dragInfo.draggableId);
    }
}