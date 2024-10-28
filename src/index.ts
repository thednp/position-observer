import { isFunction, isHTMLElement } from "@thednp/shorty";

export type PositionObserverCallback = (
  entries: PositionObserverEntry[],
) => void;
export type EntryOffsets = {
  offsetWidth: number;
  offsetHeight: number;
  offsetTop: number;
  offsetLeft: number;
  scrollLeft: number;
  scrollTop: number;
};
export type PositionObserverEntry = {
  target: HTMLElement;
  box: EntryOffsets;
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
    // viewport is basically "unknown" at this point
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
   * @param target
   */
  public observe = (target: HTMLElement) => {
    if (!isHTMLElement(target)) {
      throw new Error(
        `${errorString}: ${target} is not an instance of HTMLElement.`,
      );
    }

    /* istanbul ignore if @preserve - a guard must be set */
    if (!this._root.contains(target)) return;

    const newEntry = this._getTargetEntry(target);
    this.entries.push(newEntry);

    /* istanbul ignore else @preserve */
    if (!this._tick) {
      this._tick = requestAnimationFrame(this._runCallback);
    }
  };

  /**
   * Stop observing the position of the specified element.
   * @param target
   */
  public unobserve = (target: HTMLElement) => {
    const index = this.entries.findIndex((e) => e.target === target);
    this.entries.splice(index, 1);
  };

  /**
   * Private method responsible for all the heavy duty.
   */
  private _runCallback = () => {
    /* istanbul ignore if @preserve - a guard must be set */
    if (!this.entries.length) return;
    const updates: PositionObserverEntry[] = [];

    this.entries.forEach((entry, index) => {
      const { target, box: previousOffsets } = entry;
      /* istanbul ignore if @preserve - a guard must be set */
      if (!this._root.contains(target)) return;
      const { box, isVisible } = this._getTargetEntry(target);
      const {
        offsetLeft,
        offsetTop,
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
      } = box;

      if (
        previousOffsets.offsetLeft !== offsetLeft ||
        previousOffsets.offsetTop !== offsetTop ||
        previousOffsets.offsetWidth !== offsetWidth ||
        previousOffsets.offsetHeight !== offsetHeight ||
        previousOffsets.scrollTop !== scrollTop ||
        previousOffsets.scrollLeft !== scrollLeft
      ) {
        this.entries[index].box = box;
        this.entries[index].isVisible = isVisible;
        updates.push({ target, box, isVisible });
      }
    });

    // only execute the callback if position actually changed
    if (updates.length) {
      this._callback(updates);
    }
    requestAnimationFrame(this._runCallback);
  };

  private _getTargetEntry = (target: HTMLElement) => {
    const {
      offsetLeft,
      offsetTop,
      offsetWidth,
      offsetHeight,
      scrollTop,
      scrollLeft,
    } = target;
    const {
      clientWidth,
      clientHeight,
      scrollLeft: rootScrollX,
      scrollTop: rootScrollY,
    } = this._root;

    const isVisible = offsetTop > 1 - offsetHeight &&
      offsetLeft > 1 - offsetWidth &&
      offsetTop + offsetHeight <= clientHeight + offsetHeight - 1 &&
      offsetLeft + offsetWidth <= clientWidth + offsetWidth - 1;

    return {
      target,
      isVisible,
      box: {
        offsetLeft,
        offsetTop,
        offsetWidth,
        offsetHeight,
        scrollLeft: scrollLeft + rootScrollX,
        scrollTop: scrollTop + rootScrollY,
      },
    };
  };

  /**
   * Immediately stop observing all elements.
   */
  public disconnect = () => {
    cancelAnimationFrame(this._tick);
    this.entries.length = 0;
    this._tick = 0;
  };
}
