import {DraggableAdapter} from './adapter';
import {MDCFoundation} from '@material/base/foundation';
import {EventManager, MouseManager, PointerManager,  TouchManager} from './manager';
import {DraggableEvent} from './event';
import {_DragEventDispatcher} from './dispatcher';
import {AnimationHelper} from './utils/animation';
import {Avatar} from './avatar';
import {cssClasses, strings, numbers} from './constants';
import {Axis} from './types';

/// Counter to generate a unique id for each instance.
let idCounter: number = 0;

export class DraggableFoundation<D>  extends MDCFoundation<DraggableAdapter<D>> {
    static get cssClasses() {
        return cssClasses;
    }

    static get strings() {
        return strings;
    }

    static get numbers() {
        return numbers;
    }

    constructor(adapter?: Partial<DraggableAdapter<D>>) {
        super({...DraggableFoundation.defaultAdapter, ...adapter});
    }

    static get defaultAdapter(): DraggableAdapter<any> {
        return {
            addClass: () => undefined,
            removeClass: () => undefined,
            addDocumentClass: () => undefined,
            removeDocumentClass: () => undefined,
            hasClass: () => undefined,
            notifyAction: () => undefined,
            deregisterDocumentInteractionHandler: () => undefined,
            registerDocumentInteractionHandler: () => undefined,
            deregisterInteractionHandler: () => undefined,
            registerInteractionHandler: () => undefined,
            setStyle: () => undefined,
            getCurrentDrag: () => undefined,
            setCurrentDrag: () => undefined,
            getRootElement: () => undefined,
        };
    }

    init() {
        if (this.id) {
            this.id = idCounter++;
        }
    }

    // --------------
    // Options
    // --------------
    /// An auto-generated [id] used to identify this [Draggable].
    id: number;

    /// Data passed which is snapped to draggable
    data: D;

    /// Turn on/off draggable
    draggable: boolean = true;

    /// Axis 'both', 'vertical', 'horizontal'
    /// Set this to drag in given axis
    axis: Axis = 'both';

    /// Restricts dragging from starting to the [handle].
    /// See [Draggable] constructor.
    handle: string = null;

    /// Prevents dragging from starting on specified elements.
    /// See [Draggable] constructor.
    cancel: string = DraggableFoundation.strings.CANCEL_STRING;

    /// The minimum distance in pixels that is needed for a drag to start.
    /// See [Draggable] constructor.
    minDragStartDistance: number = DraggableFoundation.numbers.MIN_DRAG_START_DISTANCE;

    /// CSS class set to the dragged element during a drag.
    /// See [Draggable] constructor.
    draggingClass: string = DraggableFoundation.cssClasses.DRAGGING_CLASS;

    /// CSS class set to the html body tag during a drag.
    /// See [Draggable] constructor.
    draggingClassBody: string = DraggableFoundation.cssClasses.DRAGGING_BODY_CLASS;

    /// [avatar] is a function to create a [DragAvatar] for this [Draggable].
    /// See [Draggable] constructor.
    avatar: Avatar;

    /// Managers for browser events.
    _eventManagers: Array<EventManager<D>> = [];

    getId() {
        return this.id;
    }

    getAdapter() {
        return this.adapter_;
    }

    /// Handles the drag start. The [moveEvent] might either be a
    /// [TouchEvent] or a [MouseEvent].
    handleDragStart(moveEvent: UIEvent) {
        if (!this.draggable) {
            return;
        }
        // Set the drag started flag.
        this.adapter_.getCurrentDrag().started = true;

        // Pass event to AvatarHandler.
        if (this.avatar != null) {
            this.avatar._handleDragStart(this.adapter_.getCurrentDrag().element, this.adapter_.getCurrentDrag().position);
        }

        // Fire the drag start event.
        this.adapter_.notifyAction(DraggableFoundation.strings.DRAG_START_EVENT, DraggableEvent.create<D>(event, this.adapter_.getCurrentDrag()).toObject());

        // Add the css classes during the drag operation.
        if (this.draggingClass != null) {
            this.adapter_.getCurrentDrag().element.classList.add(this.draggingClass);
        }
        if (this.draggingClassBody != null) {
            this.adapter_.addDocumentClass(this.draggingClassBody);
        }

        // Text selections should not be a problem, but it seems better usability
        // to remove text selection when dragging something.
        this._clearTextSelections();
    }

    /// Handles the drag. The [moveEvent] might either be a [TouchEvent] or a
    /// [MouseEvent].
    ///
    /// The [target] is the actual target receiving the event.
    handleDrag(moveEvent: UIEvent, target: EventTarget): void {
        // Pass event to AvatarHandler.
        if (this.avatar != null) {
            this.avatar._handleDrag(this.adapter_.getCurrentDrag().startPosition, this.adapter_.getCurrentDrag().position);
        }

        // Dispatch internal drag enter, over, or leave event.
        _DragEventDispatcher.dispatchEnterOverLeave<D>(this, target);

        // Fire the drag event.
        this.adapter_.notifyAction(DraggableFoundation.strings.DRAG_EVENT, DraggableEvent.create<D>(event, this.adapter_.getCurrentDrag()).toObject());
    }

    /// Handles the drag end (mouseUp or touchEnd) event. The [event] might either
    /// be a [TouchEvent], a [MouseEvent], a [KeyboardEvent], or a [Event] (when
    /// focus is lost).
    ///
    /// The [target] is the actual target receiving the event. The [target] may
    /// be null when the event was [cancelled] (e.g. user clicked esc-key).
    ///
    /// Set [cancelled] to true to indicate that this drag ended through a
    /// cancel oparation like hitting the `esc` key.
    handleDragEnd(event: Event, target: EventTarget, {cancelled = false}): void {
        // Only handle drag end if the user actually did drag and not just clicked.
        if (this.adapter_.getCurrentDrag().started) {
            // Pass event to AvatarHandler.
            if (this.avatar != null) {
                this.avatar._handleDragEnd(this.adapter_.getCurrentDrag().startPosition, this.adapter_.getCurrentDrag().position);
            }

            // Dispatch internal drop event if drag was not cancelled.
            if (!cancelled && target != null) {
                _DragEventDispatcher.dispatchDrop<D>(this, target);
            }

            // Fire the drag end event.
            this.adapter_.notifyAction(DraggableFoundation.strings.DRAG_END_EVENT, DraggableEvent.create<D>(event, this.adapter_.getCurrentDrag(), cancelled).toObject());

            // It's needed in etc Mozilla to prevent TouchEvent not found error
            // Prevent TouchEvent from emulating a click after touchEnd event.
            if ('TouchEvent' in window && event instanceof TouchEvent && event != null) {
                event.preventDefault();
            }

            // Prevent MouseEvent from firing a click after mouseUp event.
            if (event instanceof MouseEvent) {
                this._suppressClickEvent(this.adapter_.getCurrentDrag().element);
            }

            // Remove the css classes.
            if (this.draggingClass != null) {
                this.adapter_.getCurrentDrag().element.classList.remove(this.draggingClass);
            }
            if (this.draggingClassBody != null) {
                this.adapter_.removeDocumentClass(this.draggingClassBody);
            }
        }

        // Reset.
        this._resetCurrentDrag();
    }

    /// Makes sure that a potential click event is ignored. This is necessary for
    /// [MouseEvent]s. We have to wait for and cancel a potential click event
    /// happening after the mouseUp event.
    _suppressClickEvent(element: Element): void {
        let clickHandler: any;
        element.addEventListener('click', clickHandler = (event: Event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        // Wait until the end of event loop to see if a click event is fired.
        // Then cancel the listener.
        AnimationHelper.requestUpdate( () => {
            element.removeEventListener('click', clickHandler);
            clickHandler = null;
        });
    }

    initEventManagers() {
        if (typeof window !== 'undefined') {
            if ('PointerEvent' in window) {
                this._eventManagers.push(new PointerManager<D>(this));
            } else {
                if ('TouchEvent' in window) {
                    this._eventManagers.push(new TouchManager<D>(this));
                }
                this._eventManagers.push(new MouseManager<D>(this));
            }
        }
    }

    /// Resets the draggable elements to their initial state.
    ///
    /// All listeners are uninstalled.
    destroy(): void {
        this._resetCurrentDrag();

        // Destroy all managers with their listeners.
        this._eventManagers.forEach((m) => m.destroy());
        this._eventManagers.splice(0, this._eventManagers.length);
        if (this.avatar != null && this.avatar.element != null) {
            this.avatar.element.remove();
            this.avatar = null;
        }
    }

    /// Cancels drag subscriptions and resets to initial state.
    _resetCurrentDrag(): void {
        // Reset all managers.
        this._eventManagers.forEach((m) => m.reset());

        // Reset dispatcher to fire a last internal dragLeave event.
        _DragEventDispatcher.reset<D>(this);

        // Reset the current drag.
        this.adapter_.setCurrentDrag(null);
    }

    /// Abort the current drag
    abort(): void {
        if (this.adapter_.getCurrentDrag() != null && this.adapter_.getCurrentDrag().draggableId == this.id) {
            this.handleDragEnd(null, null, {cancelled: true});
        }
    }

    /// Removes all text selections from the HTML document, including selections
    /// in active textarea or active input element.
    _clearTextSelections(): void {
        // Remove selection.
        window.getSelection().removeAllRanges();

        // Try to remove selection from textarea or input.
        try {
            var activeElement = document.activeElement;
            if (activeElement instanceof HTMLInputElement) {
                activeElement.setSelectionRange(0, 0);
            } else if (activeElement instanceof HTMLTextAreaElement) {
                activeElement.setSelectionRange(0, 0);
            }
        } catch (_) {
            // Might throw an error if the element does not support setSelectionRange.
            // This is the case for InputElement with type 'file'.
        }
    }
}