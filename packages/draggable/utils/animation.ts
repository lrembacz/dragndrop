/// Simple helper class to speed up animation with requestAnimationFrame.
export class AnimationHelper {
    static _lastUpdateFunction: () => void;
    static _updating: boolean = false;

    /// Requests that the [updateFunction] be called. When the animation frame is
    /// ready, the [updateFunction] is executed. Note that any subsequent calls
    /// in the same frame will overwrite the [updateFunction].
    static requestUpdate(updateFunction: () => void): void {
        this._lastUpdateFunction = updateFunction;

        if (!this._updating) {
            window.requestAnimationFrame(() => this._update());
            this._updating = true;
        }
    }

    /// Stops the updating.
    static stop(): void {
        this._updating = false;
    }

    static _update(): void {
        // Test if it wasn't stopped.
        if (this._updating) {
            this._lastUpdateFunction();
            this._updating = false;
        }
    }
}