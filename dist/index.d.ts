/**
 * The PositionObserver class is a utility class that observes the position
 * of DOM elements and triggers a callback when their position changes.
 */
declare class PositionObserver {
    entries: Map<Element, PositionObserverEntry>;
    static version: string;
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
     *
     * @param target an `Element` target
     */
    observe: (target: Element) => void;
    /**
     * Stop observing the position of the specified element.
     *
     * @param target an `HTMLElement` target
     */
    unobserve: (target: HTMLElement) => void;
    /**
     * Private method responsible for all the heavy duty,
     * the observer's runtime.
     */
    private _runCallback;
    /**
     * Calculate the target bounding box and determine
     * the value of `isVisible`.
     *
     * @param target an `Element` target
     */
    private _new;
    /**
     * Find the entry for a given target.
     *
     * @param target an `HTMLElement` target
     */
    getEntry: (target: Element) => PositionObserverEntry | undefined;
    /**
     * Immediately stop observing all elements.
     */
    disconnect: () => void;
}
export default PositionObserver;

declare type PositionObserverCallback = (entries: PositionObserverEntry[], observer: PositionObserver) => void;

declare type PositionObserverEntry = {
    target: Element;
    boundingClientRect: DOMRect;
};

declare type PositionObserverOptions = {
    root: HTMLElement;
};

export { }
