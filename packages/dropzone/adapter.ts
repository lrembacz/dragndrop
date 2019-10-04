import {SpecificEventListener} from '@material/base/types';

interface DropzoneAdapter {
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
    notifyAction(eventType: string, detail: any): void;
    registerInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    deregisterInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    registerDocumentInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    deregisterDocumentInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    getRootElement(): Element;
}

export {DropzoneAdapter};