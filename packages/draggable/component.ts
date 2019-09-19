import {MDCComponent} from '@material/base/component';
import {DraggableFoundation} from './foundation';
import {DragInfo} from './drag-info';
import {Avatar} from './avatar';
import {DraggableAdapter} from './adapter';
import {Axis, DraggableAttachOpts, DraggableInterface} from './types';
import {applyPassive} from '@material/dom/events';

let _currentDrag: DragInfo<any> | null;

export const DraggableAttachOptsInitial: DraggableAttachOpts<any> = {
    data: undefined,
    draggable: undefined,
    avatar: undefined,
    axis: undefined,
    handle: undefined,
    cancel: undefined,
    draggingClass: undefined,
    draggingClassBody: undefined,
    minDragStartDistance: undefined,
};

export class Draggable<D> extends MDCComponent<DraggableFoundation<D>> implements DraggableInterface {
    static attachTo<D>(root: Element, opts: DraggableAttachOpts<D> = DraggableAttachOptsInitial): Draggable<D> {
        const draggable = new Draggable<D>(root);

        if (opts.data !== undefined) {
            draggable.data = opts.data;
        }

        if (opts.draggable !== undefined) {
            draggable.draggable = opts.draggable;
        }

        if (opts.avatar !== undefined) {
            draggable.avatar = opts.avatar;
        }

        if (opts.axis !== undefined) {
            draggable.axis = opts.axis;
        }

        if (opts.handle !== undefined) {
            draggable.handle = opts.handle;
        }

        if (opts.cancel !== undefined) {
            draggable.cancel = opts.cancel;
        }

        if (opts.draggingClass !== undefined) {
            draggable.draggingClass = opts.draggingClass;
        }

        if (opts.draggingClassBody !== undefined) {
            draggable.draggingClassBody = opts.draggingClassBody;
        }

        if (opts.minDragStartDistance !== undefined) {
            draggable.minDragStartDistance = opts.minDragStartDistance;
        }

        return draggable;
    }
    root_: Element; // assigned in MDCComponent constructor

    get _id() {
        return this.foundation_.id;
    }

    get data() {
        return this.foundation_.data;
    }

    set data(data: D) {
        this.foundation_.data = data;
    }

    get draggable() {
        return this.foundation_.draggable;
    }

    set draggable(draggable: boolean) {
        this.foundation_.draggable = draggable;
    }

    get axis() {
        return this.foundation_.axis;
    }

    set axis(axis: Axis) {
        this.foundation_.axis = axis;
    }

    get handle() {
        return this.foundation_.handle;
    }

    set handle(handle: any) {
        this.foundation_.handle = handle;
    }

    get cancel() {
        return this.foundation_.cancel;
    }

    set cancel(cancel: string) {
        this.foundation_.cancel = cancel;
    }

    get minDragStartDistance() {
        return this.foundation_.minDragStartDistance;
    }

    set minDragStartDistance(minDragStartDistance: number) {
        this.foundation_.minDragStartDistance = minDragStartDistance;
    }

    get avatar() {
        return this.foundation_.avatar;
    }

    set avatar(avatar: Avatar) {
        this.foundation_.avatar = avatar;
    }

    get draggingClass() {
        return this.foundation_.draggingClass;
    }

    set draggingClass(draggingClass: string) {
        this.foundation_.draggingClass = draggingClass;
    }

    get draggingClassBody() {
        return this.foundation_.draggingClassBody;
    }

    set draggingClassBody(draggingClassBody: string) {
        this.foundation_.draggingClassBody = draggingClassBody;
    }

    initialSyncWithDOM() {
        this.foundation_.initEventManagers();
    }

    getDefaultFoundation() {
        const adapter: DraggableAdapter<D> = {
            hasClass: (className) => this.root_.classList.contains(className),
            addClass: (className) => this.root_.classList.add(className),
            removeClass: (className) => this.root_.classList.remove(className),
            addDocumentClass: (className) => document.documentElement.classList.add(className),
            removeDocumentClass: (className) => document.documentElement.classList.remove(className),
            notifyAction: (eventType: string, detail?: any) => this.emit(eventType, detail, /** shouldBubble */ true),
            deregisterDocumentInteractionHandler: (evtType: any, handler: any, passive?: boolean) =>
                document.documentElement.removeEventListener(evtType, handler, applyPassive()),
            registerDocumentInteractionHandler: (evtType: any, handler: any, passive?: boolean) =>
                document.documentElement.addEventListener(evtType, handler, applyPassive()),
            deregisterInteractionHandler: (evtType: any, handler: any, options?: AddEventListenerOptions|boolean) =>
                this.unlisten(evtType, handler, options),
            registerInteractionHandler: (evtType: any, handler: any, options?: AddEventListenerOptions|boolean) =>
                this.listen(evtType, handler, options),
            setStyle: (property: string, value: any) =>
                (this.root_ as HTMLElement).style.setProperty(property, value),
            getCurrentDrag: () => _currentDrag,
            setCurrentDrag: (currentDrag: DragInfo<D> | null) => _currentDrag = currentDrag,
            getRootElement: () => this.root_,
        };
        return new DraggableFoundation<D>(adapter);
    }

    abort(): void {
        this.foundation_.abort();
    }

    destroy(): void {
        this.foundation_.destroy();
    }
}