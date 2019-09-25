import {SpecificEventListener} from '@material/base/types';
import {DragInfo} from './drag-info';

export interface DraggableAdapter<D> {
    /**
     * Adds a class to the root Element.
     */
    addClass(className: string): void;
    /**
     * Removes a class from the root Element.
     */
    removeClass(className: string): void;
    /**
     * Returns true if the root Element contains the given class.
     */
    hasClass(className: string): boolean;
    /**
     * Adds a class to the document Element.
     */
    addDocumentClass(className: string): void;
    /**
     * Removes a class from the document Element.
     */
    removeDocumentClass(className: string): void;
    /**
     * Sets the specified inline style property on the root Element to the given value.
     */
    setStyle(property: string, value: string): void;
    /**
     * Notifies user action on draggable.
     */
    notifyAction(eventType: string, detail: any): void;
    registerInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>, options?: AddEventListenerOptions|boolean): void;
    deregisterInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>, options?: AddEventListenerOptions|boolean): void;
    registerDocumentInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>, passive?: boolean): void;
    deregisterDocumentInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>, passive?: boolean): void;
    getCurrentDrag(): DragInfo<D> | null;
    setCurrentDrag(currentDrag: DragInfo<D> | null): void;
    getRootElement(): Element;
}