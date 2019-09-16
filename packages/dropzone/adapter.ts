import {SpecificEventListener} from '@material/base/types';

interface DropzoneAdapter {
    notifyAction(eventType: string, detail: any): void;
    registerInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    deregisterInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    registerDocumentInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
    deregisterDocumentInteractionHandler<K extends any>(evtType: K, handler: SpecificEventListener<any>): void;
}

export {DropzoneAdapter};