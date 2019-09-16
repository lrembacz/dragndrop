import MDCFoundation from '@material/base/foundation';
import {DropzoneAdapter} from './adapter';
import {Acceptor} from './acceptor';
import {DropzoneEvent} from './event';
import {cssClasses, strings} from './constants';

export class DropzoneFoundation extends MDCFoundation<DropzoneAdapter> {
    static get cssClasses() {
        return cssClasses;
    }

    static get strings() {
        return strings;
    }

    constructor(adapter?: Partial<DropzoneAdapter>) {
        super({...DropzoneFoundation.defaultAdapter, ...adapter});
    }

    static get defaultAdapter(): DropzoneAdapter {
        return {
            notifyAction: () => undefined,
            deregisterDocumentInteractionHandler: () => undefined,
            registerDocumentInteractionHandler: () => undefined,
            deregisterInteractionHandler: () => undefined,
            registerInteractionHandler: () => undefined,
        };
    }

    /// The [Acceptor] used to determine which [Draggable]s will be accepted by
    /// this [Dropzone]. If none is specified, all [Draggable]s will be accepted.
    acceptor: Acceptor;

    /// CSS class set to the [Dropzone] element when an accepted [Draggable] is
    /// dragged over it. See [Dropzone] constructor.
    overClass: string = DropzoneFoundation.cssClasses.OVER_CLASS;

    /// CSS class set to the [Dropzone] element when a not-accepted [Draggable] is
    /// dragged over it. See [Dropzone] constructor.
    invalidClass: string = DropzoneFoundation.cssClasses.INVALID_CLASS;

    setAcceptor(acceptor: Acceptor) {
        this.acceptor = acceptor;
    }

    /// Handles dragEnter events.
    handleDragEnter(event: Event): void {
        // Only handle dragEnter if user moved from outside of element into the
        // element. That means we ignore it if user is coming from a child element.
        // TODO: Debug this... as it is not working for every use case
        // if ((event as MouseEvent).relatedTarget !== null &&
        //     (event.currentTarget as Element).contains((event as MouseEvent).relatedTarget as Element)) {
        //     return;
        // }

        // Test if the current draggable is accepted by this dropzone. If there is
        // no accepter all are accepted.
        if (this.acceptor == null ||
            this.acceptor.accepts((event as any).data.dragInfo, event.currentTarget as Element, event)
        ) {
            this.adapter_.notifyAction(
                DropzoneFoundation.strings.DRAG_ENTER_EVENT,
                DropzoneEvent.create((event as any).data.dragInfo, event.currentTarget as Element, event).toObject()
            );

            // Add the css class to indicate drag over.
            if (this.overClass != null) {
                (event.currentTarget as Element).classList.add(this.overClass);
            }
        } else {
            // Add the css class to indicate invalid drag over.
            if (this.invalidClass != null) {
                (event.currentTarget as Element).classList.add(this.invalidClass);
            }
        }
    }

    /// Handles dragOver events.
    handleDragOver(event: Event): void {
        // Test if the current draggable is accepted by this dropzone. If there is
        // no accepter all are accepted.
        if (this.acceptor == null ||
            this.acceptor.accepts((event as any).data.dragInfo, event.currentTarget as Element, event)
        ) {
            this.adapter_.notifyAction(
                DropzoneFoundation.strings.DRAG_OVER_EVENT,
                DropzoneEvent.create((event as any).data.dragInfo, event.currentTarget as Element, event).toObject()
            );
        }
    }

    /// Handles dragLeave events.
    handleDragLeave(event: Event): void {
        // Only handle dragLeave if user moved from inside of element to the
        // outside. That means we ignore it if user is moving to a child element.
        // TODO: Debug this... as it is not working for every use case
        // if ((event as MouseEvent).relatedTarget != null &&
        //     (event.currentTarget as Element).contains((event as MouseEvent).relatedTarget as Element)) {
        //     return;
        // }

        // Test if the current draggable is accepted by this dropzone. If there is
        // no accepter all are accepted.
        if (this.acceptor == null ||
            this.acceptor.accepts((event as any).data.dragInfo, event.currentTarget as Element, event)) {

            // Fire dragLeave event.
            this.adapter_.notifyAction(
                DropzoneFoundation.strings.DRAG_LEAVE_EVENT,
                DropzoneEvent.create((event as any).data.dragInfo, event.currentTarget as Element, event).toObject()
            );

            // Remove the css class.
            if (this.overClass != null) {
                (event.currentTarget as Element).classList.remove(this.overClass);
            }
        } else {
            // Remove the invalid drag css class.
            if (this.invalidClass != null) {
                (event.currentTarget as Element).classList.remove(this.invalidClass);
            }
        }
    }

    /// Handles drop events.
    handleDrop(event: Event): void {
        // Test if the current draggable is accepted by this dropzone. If there is
        // no accepter all are accepted.
        if (this.acceptor == null
            || this.acceptor.accepts((event as any).data.dragInfo, event.currentTarget as Element, event)
        ) {
            // Fire drop event.
            this.adapter_.notifyAction(
                DropzoneFoundation.strings.DROP_EVENT,
                DropzoneEvent.create((event as any).data.dragInfo, event.currentTarget as Element, event).toObject()
            );
        }
    }
}