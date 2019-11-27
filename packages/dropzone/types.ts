import {Acceptor} from './acceptor';

declare global {
    interface Element {
        __dropzone__: any;
    }
}

export interface DropzoneAttachOpts {
    acceptor?: Acceptor;
    exact?: boolean;
    overClass?: string;
    invalidClass?: string;
}