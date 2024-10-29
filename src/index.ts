import { isFunction, isHTMLElement } from "@thednp/shorty";

export type PositionObserverCallback = (
  entries: PositionObserverEntry[],
) => void;
export type PositionObserverEntry = {
  target: HTMLElement;
  boundingBox: DOMRect;
  isVisible: boolean;
};
export type PositionObserverOptions = {
  root: HTMLElement;
};

const errorString = "PositionObserver Error";

/**
 * The PositionObserver class is a utility class that observes the position
 * of DOM elements and triggers a callback when their position changes.
 */
export default class PositionObserver {
  public entries: PositionObserverEntry[];
  private _tick: number;
  private _root: HTMLElement;
  private _callback: PositionObserverCallback;

  /**
   * The constructor takes two arguments, a `callback`, which is called
   * whenever the position of an observed element changes and an `options` object.
   * The callback function should take an array of `PositionObserverEntry` objects
   * as its only argument, but it's not required.
   *
   * @param callback the callback that applies to all targets of this observer
   * @param options the options of this observer
   */
  constructor(
    callback: PositionObserverCallback,
    options?: Partial<PositionObserverOptions>,
  ) {
    if (!isFunction(callback)) {
      throw new Error(`${errorString}: ${callback} is not a function.`);
    }
    this.entries = [];
    this._callback = callback;
    this._root = isHTMLElement(options?.root)
      ? options.root
      /* istanbul ignore next @preserve */
      : document?.documentElement;
    this._tick = 0;
  }

  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `HTMLElement` target
   */
  public observe = (target: HTMLElement) => {
    if (!isHTMLElement(target)) {
      throw new Error(
        `${errorString}: ${target} is not an instance of HTMLElement.`,
      );
    }

    /* istanbul ignore else @preserve - a guard must be set */
    if (!this._root.contains(target)) return;

    /* istanbul ignore else @preserve - don't allow duplicate entries */
    if (this.getEntry(target)) return;

    // define a new entry
    const newEntry = this._new(target);

    // push the entry into the runtime
    this.entries.push(newEntry);

    /* istanbul ignore else @preserve */
    if (!this._tick) this._tick = requestAnimationFrame(this._runCallback);
  };

  /**
   * Stop observing the position of the specified element.
   *
   * @param target an `HTMLElement` target
   */
  public unobserve = (target: HTMLElement) => {
    const index = this.entries.findIndex((e) => e.target === target);

    /* istanbul ignore else @preserve */
    if (index > -1) this.entries.splice(index, 1);
  };

  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  private _runCallback = () => {
    /* istanbul ignore if @preserve - a guard must be set */
    if (!this.entries.length) return;
    const updates: PositionObserverEntry[] = [];

    this.entries.forEach((entry, index) => {
      const { target, boundingBox: oldBoundingBox } = entry;
      /* istanbul ignore if @preserve - a guard must be set when target has been removed */
      if (!this._root.contains(target)) return;
      const { boundingBox, isVisible } = this._new(target);
      const { left, top, bottom, right } = boundingBox;

      if (
        oldBoundingBox.left !== left || oldBoundingBox.top !== top ||
        oldBoundingBox.right !== right || oldBoundingBox.bottom !== bottom
      ) {
        this.entries[index].boundingBox = boundingBox;
        this.entries[index].isVisible = isVisible;
        updates.push({ target, boundingBox, isVisible });
      }
    });

    // only execute the callback if position actually changed
    /* istanbul ignore else @preserve */
    if (updates.length) this._callback(updates);

    requestAnimationFrame(this._runCallback);
  };

  /**
   * Calculate the target bounding box and determine
   * the value of `isVisible`.
   *
   * @param target an `HTMLElement` target
   */
  private _new = (target: HTMLElement) => {
    const { clientWidth, clientHeight } = this._root;
    const boundingBox = target.getBoundingClientRect();
    const { left, top, bottom, right, width, height } = boundingBox;

    const isVisible = top > 1 - height && left > 1 - width &&
      bottom <= clientHeight + height - 1 && right <= clientWidth + width - 1;

    return {
      target,
      isVisible,
      boundingBox,
    };
  };

  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  public getEntry = (target: HTMLElement) =>
    this.entries.find((entry) => entry.target === target);

  /**
   * Immediately stop observing all elements.
   */
  public disconnect = () => {
    cancelAnimationFrame(this._tick);
    this.entries.length = 0;
    this._tick = 0;
  };
}
