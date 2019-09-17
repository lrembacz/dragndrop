import {Avatar} from './avatar';

export interface DraggableAttachOpts<T> {
    data?: T;
    avatar?: Avatar;
    horizontalOnly?: boolean;
    verticalOnly?: boolean;
    handle?: any;
    cancel?: string;
    draggingClass?: string;
    draggingClassBody?: string;
    minDragStartDistance?: number;
}

export interface DraggableInterface {
    _id: number;
}