import './utils/remove.js';
import {AnimationHelper} from './utils/animation';
import {Point} from './utils/point';

export abstract class Avatar {
    /// Returns the [avatar] element during a drag operation.
    ///
    /// If there is no drag operation going on, [avatar] will be null.
    element: Element;

    /// The cached top margin of [avatar].
    _marginTop: number;

    // Handle case when avatar is created when element is already dragging
    _dragging: boolean = false;

    /// Returns the (cached) top margin of [avatar].
    get marginTop(): number {
        if (this._marginTop == null) {
            this.cacheMargins();
        }
        return this._marginTop;
    }

    /// The cached left margin of [avatar].
    _marginLeft: number;

    /// Returns the (cached) left margin of [avatar].
    get marginLeft(): number {
        if (this._marginLeft == null) {
            this.cacheMargins();
        }
        return this._marginLeft;
    }

    /// Saved pointer events style before the drag operation.
    _pointerEventsBeforeDrag: string;

    /// Creates an [AvatarHelper] that uses the draggable element itself as
    /// drag avatar.
    ///
    /// See [OriginalAvatar].
    static create() {
        return new OriginalAvatar();
    }

    /// Creates an [AvatarHelper] that creates a clone of the draggable element
    /// as drag avatar. The avatar is removed at the end of the drag operation.
    ///
    /// See [CloneAvatar].
    static clone() {
        return new CloneAvatar();
    }

    /// Handles the drag start.
    _handleDragStart(draggable: Element, startPosition: Point): void {
        this._dragging = true;
        this.dragStart(draggable, startPosition);

        // Sets the pointer-events CSS property of avatar to 'none' which enables
        // mouse and touch events to go trough to the element under the avatar.
        this._pointerEventsBeforeDrag = (this.element as HTMLElement).style.pointerEvents;
        (this.element as HTMLElement).style.pointerEvents = 'none';
    }

    /// Handles the drag.
    _handleDrag(startPosition: Point, position: Point): void {
        if (!this._dragging) {
            return;
        }
        this.drag(startPosition, position);
    }

    /// Handles the drag end.
    _handleDragEnd(startPosition: Point, position: Point): void {
        if (!this._dragging) {
            return;
        }
        this.dragEnd(startPosition, position);

        // Reset the pointer-events CSS property to its original value.
        (this.element as HTMLElement).style.pointerEvents = this._pointerEventsBeforeDrag;
        this._pointerEventsBeforeDrag = null;

        // Reset avatar.
        this.element = null;

        // Reset margins (causes them to be recalculated in next drag operation).
        this._marginTop = null;
        this._marginLeft = null;
        this._dragging = false;
    }

    /// Called when the drag operation starts.
    ///
    /// This method must set the [avatar] variable and must attache it to the DOM.
    ///
    /// The provided [draggable] is used to know where in the DOM the drag avatar
    /// can be inserted.
    ///
    /// The [startPosition] is the position where the drag started, relative to the
    /// whole document (page coordinates).
    abstract dragStart(draggable: Element, startPosition: Point): void;

    /// Moves the drag avatar to the new [position].
    ///
    /// The [startPosition] is the position where the drag started, [position] is the
    /// current position. Both are relative to the whole document (page coordinates).
    abstract drag(startPosition: Point, position: Point): void;

    /// Called when the drag operation ends.
    ///
    /// The [avatar] must be removed from the DOM in this method if it is not
    /// needed any more.
    ///
    /// The [startPosition] is the position where the drag started, [position] is the
    /// current position. Both are relative to the whole document (page coordinates).
    abstract dragEnd(startPosition: Point, position: Point): void;

    /// Sets the CSS transform translate of [avatar]. Uses requestAnimationFrame
    /// to speed up animation.
    setTranslate(position: Point): void {

        AnimationHelper.requestUpdate(() => {
            // Unsing `translate3d` to activate GPU hardware-acceleration (a bit of a hack).
            if (this.element != null) {
                (this.element as HTMLElement).style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
            }
        });
    }

    /// Removes the CSS transform of [avatar]. Also stops the requested animation
    /// from [setTranslate].
    removeTranslate(): void {
        AnimationHelper.stop();
        (this.element as HTMLElement).style.transform = null;
    }

    /// Sets the CSS left/top values of [avatar]. Takes care of any left/top
    /// margins the [avatar] might have to correctly position the element.
    ///
    /// Note: The [avatar] must already be in the DOM for the margins to be
    /// calculated correctly.
    setLeftTop(position: Point): void {
        (this.element as HTMLElement).style.left = `${position.x - this.marginLeft}px`;
        (this.element as HTMLElement).style.top = `${position.y - this.marginTop}px`;
    }

    /// Caches the [marginLeft] and [marginTop] of [avatar].
    ///
    /// Call this method again if those margins somehow changed during a drag
    /// operation.
    cacheMargins(): void {
        // Calculate margins.
        const computedStyles = window.getComputedStyle((this.element as HTMLElement));
        this._marginLeft = parseInt(computedStyles.marginLeft.replace('px', ''), 10) || 0;
        this._marginTop = parseInt(computedStyles.marginTop.replace('px', ''), 10) || 0;
    }
}

export class CloneAvatar extends Avatar {
    dragStart(draggable: Element, startPosition: Point): void {
        // Clone the draggable to create the avatar.
        this.element = (draggable.cloneNode(true) as Element);
        this.element.removeAttribute('id');
        (this.element as HTMLElement).style.cursor = 'inherit';

        // Ensure avatar has an absolute position.
        (this.element as HTMLElement).style.position = 'absolute';
        (this.element as HTMLElement).style.zIndex = '100';

        // Add the drag avatar to the parent element.
        draggable.parentNode.appendChild(this.element);

        // Set the initial position of avatar (relative to the closest positioned
        // ancestor).
        this.setLeftTop(new Point((draggable as HTMLElement).offsetLeft, (draggable as HTMLElement).offsetTop));
    }

    drag(startPosition: Point, position: Point): void {
        this.setTranslate(position.subtract(new Point(startPosition.x, startPosition.y)));
    }

    dragEnd(startPosition: Point, position: Point): void {
        this.element.remove();
    }
}

export class OriginalAvatar extends Avatar {
    _draggableStartOffset: Point;

    dragStart(draggable: Element, startPosition: Point): void {
        // Use the draggable itself as avatar.
        this.element = draggable;

        // Get the start offset of the draggable (relative to the closest positioned
        // ancestor).
        this._draggableStartOffset = new Point((draggable as HTMLElement).offsetLeft, (draggable as HTMLElement).offsetTop);

        // Ensure avatar has an absolute position.
        (this.element as HTMLElement).style.position = 'absolute';

        // Set the initial position of the original.
        this.setLeftTop(this._draggableStartOffset);
    }

    drag(startPosition: Point, position: Point): void {
        this.setTranslate(position.subtract(new Point(startPosition.x, startPosition.y)));
    }

    dragEnd(startPosition: Point, position: Point): void {
        // Remove the translate and set the new position as left/top.
        this.removeTranslate();

        // Set the new position as left/top. Prevent from moving past the top and
        // left borders as the user might not be able to grab the element any more.
        const constrainedPosition: Point = new Point(Math.max(1, position.x), Math.max(1, position.y));

        this.setLeftTop(constrainedPosition.subtract(new Point(startPosition.x, startPosition.y)).add(this._draggableStartOffset));
    }
}
