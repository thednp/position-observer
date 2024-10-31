import { isFunction, isHTMLElement } from "@thednp/shorty";
import { version } from "../package.json";

export type PositionObserverCallback = (
  entries: PositionObserverEntry[],
  observer: PositionObserver,
) => void;

export type PositionObserverEntry = {
  target: HTMLElement;
  boundingClientRect: DOMRect;
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
  public entries: Map<HTMLElement, PositionObserverEntry>;
  public static version = version;
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
    this.entries = new Map();
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

    // define a new entry
    // push the entry into the queue
    this._new(target).then((newEntry) => {
      /* istanbul ignore else @preserve - don't allow duplicate entries */
      if (!this.getEntry(target)) this.entries.set(target, newEntry);

      /* istanbul ignore else @preserve */
      if (!this._tick) this._tick = requestAnimationFrame(this._runCallback);
    });
  };

  /**
   * Stop observing the position of the specified element.
   *
   * @param target an `HTMLElement` target
   */
  public unobserve = (target: HTMLElement) => {
    /* istanbul ignore else @preserve */
    if (this.entries.has(target)) this.entries.delete(target);
  };

  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  private _runCallback = () => {
    /* istanbul ignore if @preserve - a guard must be set */
    if (!this.entries.size) return;

    const queue = new Promise<PositionObserverEntry[]>((resolve) => {
      const updates: PositionObserverEntry[] = [];
      this.entries.forEach(
        async ({ target, boundingClientRect: oldBoundingBox }) => {
          /* istanbul ignore if @preserve - a guard must be set when target has been removed */
          if (!this._root.contains(target)) return;

          await this._new(target).then(({ boundingClientRect, isVisible }) => {
            const { left, top, bottom, right } = boundingClientRect;

            if (
              oldBoundingBox.top !== top || oldBoundingBox.left !== left ||
              oldBoundingBox.right !== right || oldBoundingBox.bottom !== bottom
            ) {
              const newEntry = { target, boundingClientRect, isVisible };
              this.entries.set(target, newEntry);
              updates.push(newEntry);
            }
          });
        },
      );

      resolve(updates);
    });

    requestAnimationFrame(async () => {
      const updates = await queue;

      // only execute the callback if position actually changed
      /* istanbul ignore else @preserve */
      if (updates.length) this._callback(updates, this);

      this._runCallback();
    });
  };

  /**
   * Calculate the target bounding box and determine
   * the value of `isVisible`.
   *
   * @param target an `HTMLElement` target
   */
  private _new = (target: HTMLElement) => {
    const { clientWidth, clientHeight } = this._root;

    return new Promise<PositionObserverEntry>((resolve) => {
      const intersectionObserver = new IntersectionObserver(
        ([{ boundingClientRect }], ob) => {
          ob.disconnect();
          const { left, top, bottom, right, width, height } =
            boundingClientRect;
          const isVisible = top > 1 - height && left > 1 - width &&
            bottom <= clientHeight + height - 1 &&
            right <= clientWidth + width - 1;

          resolve({
            target,
            isVisible,
            boundingClientRect,
          });
        },
      );

      intersectionObserver.observe(target);
    });
  };

  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  public getEntry = (target: HTMLElement) => this.entries.get(target);

  /**
   * Immediately stop observing all elements.
   */
  public disconnect = () => {
    cancelAnimationFrame(this._tick);
    this.entries.clear();
    this._tick = 0;
  };
}
