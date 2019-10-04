import {Acceptor} from './acceptor';

export interface DropzoneAttachOpts {
    acceptor?: Acceptor;
    exact?: boolean;
    overClass?: string;
    invalidClass?: string;
}