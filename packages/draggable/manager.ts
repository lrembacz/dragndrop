/// Class responsible for managing browser events.
///
/// This class is an abstraction for the specific managers
/// [_TouchManager], [_MouseManager], and [_PointerManager].
import {Point} from './utils/point';
import {DragInfo} from './drag-info';
import {matchesWithAncestors} from './utils/element';
import {DraggableFoundation} from './foundation';

export abstract class EventManager<D> {
    /// Tracks subscriptions for start events (mouseDown, touchStart).
    startSubs: Array<any> = [];

    /// Tracks subscriptions for all other events (mouseMove, touchMove, mouseUp,
    /// touchEnd, and more).
    dragSubs: Array<any> = [];

    /// A reference back to the [Draggable].
    foundation: DraggableFoundation<D>;

    constructor(foundation: DraggableFoundation<D>) {
        this.foundation = foundation;
        // Install the start listeners when constructed.
        this.installStart();

        // Disable touch actions (scrolling, panning, zooming) depending on
        // horizontalOnly / verticalOnly options.
        if (foundation.axis === 'horizontal') {
            // Only allow vertical scrolling, panning.
            this.foundation.getAdapter().setStyle('touchAction', 'pan-y');
        } else if (foundation.axis === 'vertical') {
            // Only allow horizontal scrolling, panning.
            this.foundation.getAdapter().setStyle('touchAction', 'pan-x');
        } else {
            // No scrolling, panning.
            this.foundation.getAdapter().setStyle('touchAction', 'none');
        }
    }

    /// Installs the start listeners (e.g. mouseDown, touchStart, etc.).
    abstract installStart(): void;

    /// Installs the move listeners (e.g. mouseMove, touchMove, etc.).
    abstract installMove(): void;

    /// Installs the end listeners (e.g. mouseUp, touchEnd, etc.).
    abstract installEnd(): void;

    /// Installs the cancel listeners (e.g. touchCancel, pointerCancel, etc.).
    abstract installCancel(): void;

    /// Installs listener for esc-key and blur (window loses focus). Those
    /// events will cancel the drag operation.
    installEscAndBlur(): void {
        let escHandler: any;
        let blurHandler: any;

        // Drag ends when escape key is hit.
        this.foundation.getAdapter().registerDocumentInteractionHandler('keydown', escHandler = (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.keyCode === 27) {
                this.handleCancel(keyboardEvent);
            }
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('keydown', escHandler));

        // Drag ends when focus is lost.
        this.foundation.getAdapter().registerDocumentInteractionHandler('blur', blurHandler = (event: Event) => {
            this.handleCancel(event);
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('blur', blurHandler));
    }

    /// Handles a start event (touchStart, mouseUp, etc.).
    handleStart(event: Event, position: Point): void {
        // Initialize the drag info.
        // Note: the drag is not started on touchStart but after a first valid move.
        const dragInfo: DragInfo<D> = new DragInfo(
            this.foundation.id,
            (event.currentTarget as Element),
            this.foundation.data,
            position,
            this.foundation.avatar,
            this.foundation.axis
        );
        this.foundation.getAdapter().setCurrentDrag(dragInfo);

        // Install listeners to detect a drag move, end, or cancel.
        this.installMove();
        this.installEnd();
        this.installCancel();
        this.installEscAndBlur();
    }

    /// Handles a move event (touchMove, mouseMove, etc.).
    handleMove(event: Event, position: Point, clientPosition: Point): void {
        // Set the current position.
        this.foundation.getAdapter().getCurrentDrag().position = position;

        if (!this.foundation.getAdapter().getCurrentDrag().started) {
            // Test if drag has moved far enough to start drag.
            if (this.foundation.getAdapter().getCurrentDrag().startPosition.distanceTo(this.foundation.getAdapter().getCurrentDrag().position) >=
                this.foundation.minDragStartDistance) {
                // Drag starts now.
                this.foundation.handleDragStart(event as UIEvent);
            }
        } else {
            // Drag already started.
            const realTarget: EventTarget = this._getRealTarget(clientPosition);
            this.foundation.handleDrag((event as UIEvent), (realTarget as Element));
        }
    }

    /// Handles all end events (touchEnd, mouseUp, and pointerUp).
    handleEnd(event: Event, target: EventTarget, position: Point, clientPosition: Point): void {
        // Set the current position.
        this.foundation.getAdapter().getCurrentDrag().position = position;

        const realTarget: EventTarget = this._getRealTarget(clientPosition, target);
        this.foundation.handleDragEnd(event, realTarget, {cancelled: false});
    }

    /// Handles all cancel events (touchCancel and pointerCancel).
    handleCancel(event: Event): void {
        // Drag end with the cancelled flag.
        this.foundation.handleDragEnd(event, null, {cancelled: true});
    }

    /// Resets this [_EventManager] to its initial state. This means that all
    /// listeners are canceled except the listeners set up during [installStart].
    reset(): void {
        // Cancel drag subscriptions.
        this.dragSubs.forEach((sub) => sub());
        this.dragSubs.splice(0, this.dragSubs.length);
    }

    /// Cancels all listeners, including the listeners set up during [installStart].
    destroy(): void {
        this.reset();

        // Cancel start subscriptions.
        this.startSubs.forEach((sub) => sub());
        this.startSubs.splice(0, this.startSubs.length);

        // Reset the touch action property.
        this.foundation.getAdapter().setStyle('touchAction', null);
    }

    /// Determine a target using `document.elementFromPoint` via the provided [clientPosition].
    ///
    /// Falls back to `document.body` if no element is found at the provided [clientPosition].
    _getRealTargetFromPoint(clientPosition: Point): EventTarget {
        return document.elementFromPoint(
            Math.round(clientPosition.x),
            Math.round(clientPosition.y)
        ) || document.body;
    }

    /// Determine the actual target that should receive the event because
    /// mouse or touch event might have occurred on a drag avatar.
    ///
    /// If a [target] is provided it is tested to see if is already the correct
    /// target or if it is the drag avatar and thus must be replaced by the
    /// element underneath.
    _getRealTarget(clientPosition: Point,  target?: EventTarget): EventTarget {
        // If no target was provided get it.
        if (target == null) {
            target = this._getRealTargetFromPoint(clientPosition);
        }

        // Test if target is the drag avatar.
        if (this.foundation.avatar != null &&
            this.foundation.avatar.element != null &&
            this.foundation.avatar.element.contains((target as HTMLElement))) {
            // Target is the drag avatar, get element underneath.
            (this.foundation.avatar.element as HTMLElement).style.visibility = 'hidden';
            target = this._getRealTargetFromPoint(clientPosition);
            (this.foundation.avatar.element as HTMLElement).style.visibility = 'visible';
        }

        target = this._recursiveShadowDomTarget(clientPosition, target);

        return target;
    }

    /// Recursively searches for the real target inside the Shadow DOM for all
    /// Shadow hosts with the attribute [SHADOW_DOM_RETARGET_ATTRIBUTE].
    /// Attribute for now is not used!
    _recursiveShadowDomTarget(clientPosition: Point, target: EventTarget): EventTarget {
        // Retarget if target is a shadow host and has the specific attribute.
        // TODO: Debug this to work properly
        if (target && (target as Element).shadowRoot !== null /*&& (target as Element).attributes.getNamedItem(DraggableFoundation.strings.SHADOW_DOM_RETARGET_ATTRIBUTE)*/) {
            const newTarget: Element | null = (target as Element)
                .shadowRoot
                .elementFromPoint(Math.round(clientPosition.x), Math.round(clientPosition.y));

            // Need to check if there is null for newTarget
            // and check if the newTarget and Target are different elements
            // to prevent infinite loop
            if (newTarget !== null && newTarget !== target) {
                // Recursive call for nested shadow DOM trees.
                // return newTarget;
                target = this._recursiveShadowDomTarget(clientPosition, newTarget);
            }
        }
        return target;
    }

    /// Tests if [target] is a valid place to start a drag. If [handle] is
    /// provided, drag can only start on the [handle]s. If [cancel] is
    /// provided, drag cannot be started on those elements.
    _isValidDragStartTarget(target: EventTarget): boolean {
        // Test if a drag was started on a cancel element.
        if (this.foundation.cancel != null && target && matchesWithAncestors((target as Element), this.foundation.cancel)) {
            return false;
        }

        // If handle is specified, drag must start on handle or one of its children.
        if (this.foundation.handle != null) {
            if ((target as Element)) {
                // 1. The target must match the handle query String.
                if (!matchesWithAncestors(target as Element, this.foundation.handle)) {
                    return false;
                }

                // 2. The target must be a child of the drag element(s).
                if ((this.foundation.getAdapter().getRootElement() as HTMLElement).contains(target as Element) != null) {
                    return true;
                }
            }

            // Has a handle specified but we did not find a match.
            return false;
        }

        return true;
    }
}

/// Manages the browser's touch events.
export class TouchManager<D> extends EventManager<D> {
    constructor(foundation: DraggableFoundation<D>) {
        super(foundation);
    }

    installStart(): void {
        let touchStartHandler: any;
        this.foundation.getAdapter().registerInteractionHandler('touchstart',touchStartHandler = (event: Event) => {
            // Ignore if drag is already beeing handled.
            if (this.foundation.getAdapter().getCurrentDrag() != null) {
                return;
            }

            // Ignore multi-touch events.
            if ((event as TouchEvent).touches.length > 1) {
                return;
            }

            // Ensure the drag started on a valid target.
            if (!this._isValidDragStartTarget((event as TouchEvent).touches[0].target)) {
                return;
            }

            this.handleStart(event, new Point((event as TouchEvent).touches[0].pageX, (event as TouchEvent).touches[0].pageY));
        });

        this.startSubs.push(() => this.foundation.getAdapter().deregisterInteractionHandler('touchstart', touchStartHandler));
    }

    installMove(): void {
        let touchMoveHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('touchmove', touchMoveHandler = (event: TouchEvent) => {
            // Stop and cancel subscriptions on multi-touch.
            if (event.touches.length > 1) {
                this.handleCancel(event);
                return;
            }

            // Do a scrolling test if this is the first drag.
            if (!this.foundation.getAdapter().getCurrentDrag().started && this.isScrolling(new Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY))) {
                // The user is scrolling --> Stop tracking current drag.
                this.handleCancel(event);
                return;
            }

            this.handleMove(
                event,
                new Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY),
                new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
            );

            // Prevent touch scrolling.
            event.preventDefault();
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('touchmove', touchMoveHandler));
    }

    installEnd(): void {

        let touchEndHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('touchend',touchEndHandler = (event: TouchEvent) => {
            this.handleEnd(
                event,
                null,
                new Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY),
                new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
            );
        });

        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('touchend', touchEndHandler));
    }

    installCancel(): void {
        let touchCancelHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('touchcancel',touchCancelHandler = (event: TouchEvent) => {
            this.handleCancel(event);
        });

        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('touchcancel', touchCancelHandler));
    }

    /// Returns true if there was scrolling activity instead of dragging.
    isScrolling(currentPosition: Point): boolean {
        const delta: Point = currentPosition.subtract(new Point(this.foundation.getAdapter().getCurrentDrag().startPosition.x, this.foundation.getAdapter().getCurrentDrag().startPosition.y));

        // If horizontalOnly test for vertical movement.
        if ((this.foundation.axis === 'horizontal') && (Math.abs(delta.y) > Math.abs(delta.x))) {
            // Vertical scrolling.
            return true;
        }

        // If verticalOnly test for horizontal movement.
        if ((this.foundation.axis === 'vertical') && (Math.abs(delta.x) > Math.abs(delta.y))) {
            // Horizontal scrolling.
            return true;
        }

        // No scrolling.
        return false;
    }
}

/// Manages the browser's mouse events.
export class MouseManager<D> extends EventManager<D> {

    constructor(foundation: DraggableFoundation<D>) {
        super(foundation);
    }

    installStart(): void {
        let mouseDownHandler = (event: Event) => {
            // Ignore if drag is already beeing handled.
            if (this.foundation.getAdapter().getCurrentDrag() != null) {
                return;
            }
            // Only handle left clicks, ignore clicks from right or middle buttons.
            if ((event as MouseEvent).button != 0) {
                return;
            }
            // Ensure the drag started on a valid target.
            if (!this._isValidDragStartTarget(event.target)) {
                return;
            }
            // Prevent default on mouseDown. Reasons:
            // * Disables image dragging handled by the browser.
            // * Disables text selection.
            //
            // Note: We must NOT prevent default on form elements. Reasons:
            // * SelectElement would not show a dropdown.
            // * InputElement and TextAreaElement would not get focus.
            // * ButtonElement and OptionElement - don't know if this is needed??
            const target = event.target;
            if (!(target instanceof HTMLSelectElement ||
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLButtonElement ||
                target instanceof HTMLOptionElement)
            ) {
                event.preventDefault();
            }
            this.handleStart(event, new Point((event as MouseEvent).pageX, (event as MouseEvent).pageY));
        };

        this.foundation.getAdapter().registerInteractionHandler('mousedown', mouseDownHandler);

        this.startSubs.push(() => this.foundation.getAdapter().deregisterInteractionHandler('mousedown', mouseDownHandler));
    }

    installMove(): void {
        let mouseMoveHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('mousemove', mouseMoveHandler = (event: Event) => {
            this.handleMove(
                event,
                new Point((event as MouseEvent).pageX, (event as MouseEvent).pageY),
                new Point((event as MouseEvent).clientX, (event as MouseEvent).clientY),
            );
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('mousemove', mouseMoveHandler));
    }

    installEnd(): void {
        let mouseUpHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('mouseup', mouseUpHandler = (event: Event) => {
            this.handleEnd(
                event,
                event.target,
                new Point((event as MouseEvent).pageX, (event as MouseEvent).pageY),
                new Point((event as MouseEvent).clientX, (event as MouseEvent).clientY),
            );
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('mouseup', mouseUpHandler));
    }

    installCancel(): void {
        // No mouse cancel event.
    }
}

/// Manages the browser's pointer events (used for Internet Explorer).
export class PointerManager<D> extends EventManager<D> {
    constructor(foundation: DraggableFoundation<D>) {
        super(foundation);
    }

    installStart(): void {
        let pointerDownHandler: any;

        this.foundation.getAdapter().registerInteractionHandler('pointerdown',pointerDownHandler = (event: Event) => {
            // Ignore if drag is already beeing handled.
            if (this.foundation.getAdapter().getCurrentDrag() != null) {
                return;
            }

            // Only handle left clicks, ignore clicks from right or middle buttons.
            if ((event as PointerEvent).button != 0) {
                return;
            }

            // Ensure the drag started on a valid target.
            if (!this._isValidDragStartTarget(event.target)) {
                return;
            }

            // Prevent default on mouseDown. Reasons:
            // * Disables image dragging handled by the browser.
            // * Disables text selection.
            //
            // Note: We must NOT prevent default on form elements. Reasons:
            // * SelectElement would not show a dropdown.
            // * InputElement and TextAreaElement would not get focus.
            // * ButtonElement and OptionElement - don't know if this is needed??
            const target = event.target;
            if (!(target instanceof HTMLSelectElement ||
                    target instanceof HTMLInputElement ||
                    target instanceof HTMLTextAreaElement ||
                    target instanceof HTMLButtonElement ||
                    target instanceof HTMLOptionElement)
            ) {
                event.preventDefault();
            }
            this.handleStart(event, new Point((event as PointerEvent).pageX, (event as PointerEvent).pageY));
        });
        this.startSubs.push(() => this.foundation.getAdapter().deregisterInteractionHandler('pointerdown', pointerDownHandler));
    }

    installMove(): void {
        let pointerMoveHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('pointermove', pointerMoveHandler = (event: PointerEvent) => {
            this.handleMove(
                event,
                new Point(event.pageX, event.pageY),
                new Point(event.clientX, event.clientY),
            );
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('pointermove', pointerMoveHandler));
    }

    installEnd(): void {
        let pointerUpHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('pointerup', pointerUpHandler = (event: PointerEvent) => {
            this.handleEnd(
                event,
                null,
                new Point(event.pageX, event.pageY),
                new Point(event.clientX, event.clientY),
            );
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('pointerup', pointerUpHandler));
    }

    installCancel(): void {
        let pointerCancelHandler: any;
        this.foundation.getAdapter().registerDocumentInteractionHandler('pointercancel', pointerCancelHandler = (event: PointerEvent) => {
            this.handleCancel(event);
        });
        this.dragSubs.push(() => this.foundation.getAdapter().deregisterDocumentInteractionHandler('pointercancel', pointerCancelHandler));
    }
}