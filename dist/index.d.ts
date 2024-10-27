export type PositionObserverCallback = (entries: PositionObserverEntry[]) => void;
export type PositionObserverEntry = {
	target: HTMLElement;
	boundingBox: DOMRect;
	isVisible: boolean;
};
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
	 * The constructor takes a single argument, callback, which is called
	 * whenever the position of an observed element changes. The callback function
	 * should take an array of `PositionObserverEntry` objects as its only argument.
	 *
	 * @param callback the callback that applies to all targets of this observer
	 */
	constructor(callback: PositionObserverCallback);
	/**
	 * Start observing the position of the specified element.
	 * If the element is not currently attached to the DOM,
	 * it will be attached before observation begins.
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
	/**
	 * Immediately stop observing all elements.
	 */
	disconnect: () => void;
}

export {
	PositionObserver as default,
};

export as namespace PotitionObserver;

export {};
