import {Avatar} from './avatar';
import {Point} from './utils/point';

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
    customScroll?: CustomScroll
}

export type CustomScroll = ((startPosition: Point, currentPosition: Point) => void) | boolean;

export interface DraggableInterface {
    _id: number;
}