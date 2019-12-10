import {MDCComponent} from '@material/base/component';
import {DropzoneFoundation} from './foundation';
import {Acceptor} from './acceptor';
import {DropzoneAdapter} from './adapter';
import {CustomEventListener} from '@material/base/types';
import {applyPassive} from '@material/dom/events';
import {DropzoneAttachOpts} from './types';
import {DraggableFoundation} from '@dragndrop/draggable/foundation';

export const DropzoneAttachOptsInitial: DropzoneAttachOpts = {
    acceptor: undefined,
    exact: undefined,
    overClass: undefined,
    invalidClass: undefined,
    allowOnChild: undefined,
};

export class Dropzone extends MDCComponent<DropzoneFoundation> {
    static attachTo(root: Element, opts: DropzoneAttachOpts = DropzoneAttachOptsInitial): Dropzone {
        const dropzone = new Dropzone(root);

        if (opts.acceptor !== undefined) {
            dropzone.acceptor = opts.acceptor;
        }

        if (opts.exact !== undefined) {
            dropzone.exact = opts.exact;
        }

        if (opts.overClass !== undefined) {
            dropzone.overClass = opts.overClass;
        }

        if (opts.invalidClass !== undefined) {
            dropzone.invalidClass = opts.invalidClass;
        }

        if (opts.allowOnChild !== undefined) {
            dropzone.allowOnChild = opts.allowOnChild;
        }

        return dropzone;
    }

    initialize(..._args: any[]): void {
        this.root_.__dropzone__ = this;
    }

    private handleDragEnter_: CustomEventListener<Event>; // assigned in initialSyncWithDOM()
    private handleDragOver_: CustomEventListener<Event>; // assigned in initialSyncWithDOM()
    private handleDragLeave_: CustomEventListener<Event>; // assigned in initialSyncWithDOM()
    private handleDrop_: CustomEventListener<Event>; // assigned in initialSyncWithDOM()

    initialSyncWithDOM() {
        this.handleDragEnter_ = this.handleDragEnterEvent_.bind(this);
        this.handleDragOver_ = this.handleDragOverEvent_.bind(this);
        this.handleDragLeave_ = this.handleDragLeaveEvent_.bind(this);
        this.handleDrop_ = this.handleDropEvent_.bind(this);

        this.listen(DraggableFoundation.strings.CUSTOM_DRAG_ENTER, this.handleDragEnter_);
        this.listen(DraggableFoundation.strings.CUSTOM_DRAG_OVER, this.handleDragOver_);
        this.listen(DraggableFoundation.strings.CUSTOM_DRAG_LEAVE, this.handleDragLeave_);
        this.listen(DraggableFoundation.strings.CUSTOM_DROP, this.handleDrop_);
    }

    destroy() {
        this.unlisten(DraggableFoundation.strings.CUSTOM_DRAG_ENTER, this.handleDragEnter_);
        this.unlisten(DraggableFoundation.strings.CUSTOM_DRAG_OVER, this.handleDragOver_);
        this.unlisten(DraggableFoundation.strings.CUSTOM_DRAG_LEAVE, this.handleDragLeave_);
        this.unlisten(DraggableFoundation.strings.CUSTOM_DROP, this.handleDrop_);
        delete this.root_.__dropzone__;
    }

    getDefaultFoundation() {
        const adapter: DropzoneAdapter = {
            hasClass: (className) => this.root_.classList.contains(className),
            addClass: (className) => this.root_.classList.add(className),
            removeClass: (className) => this.root_.classList.remove(className),
            notifyAction: (eventType: string, detail?: any) => this.emit(eventType, detail, /** shouldBubble */ true),
            deregisterDocumentInteractionHandler: (evtType: any, handler: any, passive?: boolean) =>
                document.documentElement.removeEventListener(evtType, handler, passive ? passive : applyPassive()),
            registerDocumentInteractionHandler: (evtType: any, handler: any, passive?: boolean) =>
                document.documentElement.addEventListener(evtType, handler, passive ? passive : applyPassive()),
            deregisterInteractionHandler: (evtType: any, handler: any) =>
                (this.root_ as HTMLElement).removeEventListener(evtType, handler),
            registerInteractionHandler: (evtType: any, handler: any) =>
                (this.root_ as HTMLElement).addEventListener(evtType, handler),
            getRootElement: () => this.root_,
        };
        return new DropzoneFoundation(adapter);
    }

    root_: Element; // assigned in MDCComponent constructor

    get exact() {
        return this.foundation_.exact;
    }

    set exact(exact: boolean) {
        this.foundation_.exact = exact;
    }

    get acceptor() {
        return this.foundation_.acceptor;
    }

    set acceptor(acceptor: Acceptor) {
        this.foundation_.acceptor = acceptor;
    }

    get overClass() {
        return this.foundation_.overClass;
    }

    set overClass(overClass: string) {
        this.foundation_.overClass = overClass;
    }

    get invalidClass() {
        return this.foundation_.invalidClass;
    }

    set invalidClass(invalidClass: string) {
        this.foundation_.invalidClass = invalidClass;
    }

    get allowOnChild() {
        return this.foundation_.allowOnChild;
    }

    set allowOnChild(allowOnChild) {
        this.foundation_.allowOnChild = allowOnChild;
    }

    handleDragEnterEvent_(evt: Event) {
        this.foundation_.handleDragEnter(evt);
    }

    handleDragOverEvent_(evt: Event) {
        this.foundation_.handleDragOver(evt);

    }

    handleDragLeaveEvent_(evt: Event) {
        this.foundation_.handleDragLeave(evt);

    }

    handleDropEvent_(evt: Event) {
        this.foundation_.handleDrop(evt);
    }
}