import {Avatar} from './avatar';

export type Axis = 'both' | 'horizontal' | 'vertical';

export interface DraggableAttachOpts<T> {
    data?: T;
    draggable: boolean;
    avatar?: Avatar;
    axis: Axis;
    handle?: any;
    cancel?: string;
    draggingClass?: string;
    draggingClassBody?: string;
    minDragStartDistance?: number;
    touchAction?: string | null;
}

export interface DraggableInterface {
    _id: number;
}