import {Point} from './utils/point';
import {Avatar} from './avatar';


export class DragInfo<D> {
    /// The id of the currently dragged [Draggable].
    draggableId: number;

    /// The dragged element.
    element: Element;

    /// Position where the drag started.
    startPosition: Point;

    /// The [Avatar] or null if there is none.
    avatar: Avatar;

    /// The current position of the mouse or touch. This position is constrained
    /// by the horizontal/vertical axis.
    _position: Point;

    // Data which is snapped to the draggable
    data: D;

    /// Flag indicating if the drag started.
    started: boolean = false;

    horizontalOnly: boolean;
    verticalOnly: boolean;

    constructor(
        draggableId: number,
        element: Element,
        data: D,
        startPosition: Point,
        avatar: Avatar,
        horizontalOnly = false,
        verticalOnly = false

    ) {
        this.draggableId = draggableId;
        this.element = element;
        this.data = data;
        this.startPosition = startPosition;
        this.avatar = avatar;
        this.horizontalOnly = horizontalOnly;
        this.verticalOnly = verticalOnly;
        // Initially set current position to startPosition.
        this._position = startPosition;
    }

    /// The current position, constrained by the horizontal/vertical axis
    /// depending on [horizontalOnly] and [verticalOnly].
    get position(): Point {
        return this._position
    };

    /// Sets the current position.
    set position(pos: Point) {
        this._position = this._constrainAxis(pos);
    }

    /// Constrains the axis if [horizontalOnly] or [verticalOnly] is true.
    _constrainAxis(pos: Point): Point {
        // Set y-value to startPosition if horizontalOnly.
        if (this.horizontalOnly) {
            return new Point(pos.x, this.startPosition.y);
        }

        // Set x-value to startPosition if verticalOnly.
        if (this.verticalOnly) {
            return new Point(this.startPosition.x, pos.y);
        }

        // Axis is not constrained.
        return pos;
    }
}