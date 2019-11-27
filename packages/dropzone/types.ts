import {Acceptor} from './acceptor';
import {Dropzone} from './component';

declare global {
    interface Element {
        __dropzone__: Dropzone;
    }
}

export interface DropzoneAttachOpts {
    acceptor?: Acceptor;
    exact?: boolean;
    overClass?: string;
    invalidClass?: string;
}