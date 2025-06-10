//#region src/index.d.ts
type PositionObserverCallback = (entries: IntersectionObserverEntry[], observer: PositionObserver) => void;
type CallbackMode = "all" | "intersecting" | "update";
type PositionObserverOptions = {
  root?: Element;
  rootMargin?: IntersectionObserverInit["rootMargin"];
  threshold?: IntersectionObserverInit["threshold"];
  callbackMode?: CallbackMode;
};
/**
 * The PositionObserver class is a utility class that observes the position
 * of DOM elements and triggers a callback when their position changes.
 */
declare class PositionObserver {
  entries: Map<Element, IntersectionObserverEntry>;
  static version: string;
  /** `PositionObserver.tick` */
  protected _t: number;
  /** `PositionObserver.root` */
  protected _r: Element;
  /** `PositionObserver.callbackMode` */
  protected _cm: 0 | 1 | 2;
  /** `PositionObserver.root.clientWidth` */
  protected _w: number;
  /** `PositionObserver.root.clientHeight` */
  protected _h: number;
  /** `IntersectionObserver.options.rootMargin` */
  protected _rm: string | undefined;
  /** `IntersectionObserver.options.threshold` */
  protected _th: number | number[] | undefined;
  /** `PositionObserver.callback` */
  protected _c: PositionObserverCallback;
  /**
   * The constructor takes two arguments, a `callback`, which is called
   * whenever the position of an observed element changes and an `options` object.
   * The callback function takes an array of `PositionObserverEntry` objects
   * as its only argument, but it's not required.
   *
   * @param callback the callback that applies to all targets of this observer
   * @param options the options of this observer
   */
  constructor(callback: PositionObserverCallback, options?: PositionObserverOptions);
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
   * @param target an `Element` target
   */
  unobserve: (target: Element) => void;
  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   * `PositionObserver.runCallback`
   */
  protected _rc: () => void;
  /**
   * Check intersection status and resolve it
   * right away.
   *
   * `PositionObserver.newEntryForTarget`
   *
   * @param target an `Element` target
   */
  protected _n: (target: Element) => Promise<IntersectionObserverEntry>;
  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  getEntry: (target: Element) => IntersectionObserverEntry | undefined;
  /**
   * Immediately stop observing all elements.
   */
  disconnect: () => void;
}
//#endregion
export { PositionObserverCallback, PositionObserverOptions, PositionObserver as default };
//# sourceMappingURL=index.d.ts.map