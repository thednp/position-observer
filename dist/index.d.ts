/**
 * The PositionObserver class is a utility class that observes the position
 * of DOM elements and triggers a callback when their position changes.
 */
declare class PositionObserver {
    entries: PositionObserverEntry[];
    private _tick;
    private _root;
    private _callback;
    /**
     * The constructor takes two arguments, a `callback`, which is called
     * whenever the position of an observed element changes and an `options` object.
     * The callback function should take an array of `PositionObserverEntry` objects
     * as its only argument, but it's not required.
     *
     * @param callback the callback that applies to all targets of this observer
     * @param options the options of this observer
     */
    constructor(callback: PositionObserverCallback, options?: Partial<PositionObserverOptions>);
    /**
     * Start observing the position of the specified element.
     * If the element is not currently attached to the DOM,
     * it will NOT be added to the entries.
     * @param target
     */
    observe: (target: HTMLElement) => void;
    /**
     * Stop observing the position of the specified element.
     * @param target
     */
    unobserve: (target: HTMLElement) => void;
    /**
     * Private method responsible for all the heavy duty.
     */
    private _runCallback;
    private _getTargetEntry;
    /**
     * Immediately stop observing all elements.
     */
    disconnect: () => void;
}
export default PositionObserver;

declare type PositionObserverCallback = (entries: PositionObserverEntry[]) => void;

declare type PositionObserverEntry = {
    target: HTMLElement;
    boundingBox: DOMRect;
    isVisible: boolean;
};

declare type PositionObserverOptions = {
    root: HTMLElement;
};

export { }
