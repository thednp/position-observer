//#region src/index.d.ts
/**
 * Callback invoked when observed element positions change.
 *
 * @param entries - Array of `IntersectionObserverEntry` objects whose
 * `boundingClientRect` changed or whose root size changed
 * @param observer - The `PositionObserver` instance that triggered the callback
 * @returns void
 */
type PositionObserverCallback = (entries: IntersectionObserverEntry[], observer: PositionObserver) => void;
/**
 * Options for the `PositionObserver` constructor.
 *
 * `root` is the `PositionObserver` root only — the internal
 * `IntersectionObserver` always uses `document` as root.
 * `rootMargin` and `threshold` are forwarded to that `IntersectionObserver`
 * and only affect the `isIntersecting` gate.
 */
type PositionObserverOptions = {
  /**
   * Element whose `clientWidth`/`clientHeight` are tracked and whose
   * position is used as a size trigger. Defaults to `document.documentElement`.
   * The underlying `IntersectionObserver` ignores this and always observes
   * against `document`.
   */
  root?: Element;
  /**
   * Margin around the `IntersectionObserver` root.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   */
  rootMargin?: IntersectionObserverInit["rootMargin"];
  /**
   * Threshold(s) for the `IntersectionObserver`.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds
   */
  threshold?: IntersectionObserverInit["threshold"];
};
/**
 * Lightweight `scroll`/`resize` replacement built on
 * `IntersectionObserver` + `requestAnimationFrame`.
 *
 * Asynchronously observes changes in a target's `top`/`left`
 * and its root's `clientWidth`/`clientHeight`. Wraps a one-shot
 * `IntersectionObserver` (root always `document`) per target per frame
 * inside a `requestAnimationFrame` loop.
 *
 * @example
 * ```ts
 * import PositionObserver from "jsr:@thednp/position-observer";
 *
 * const target = document.getElementById("target")!;
 * const observer = new PositionObserver((entries) => {
 *   for (const e of entries) {
 *     if (e.isIntersecting) console.log(e.boundingClientRect);
 *   }
 * });
 * observer.observe(target);
 * ```
 *
 * @example
 * ```ts
 * // Custom root (scrollable container)
 * const root = document.getElementById("scrollContainer")!;
 * const observer = new PositionObserver(callback, { root, threshold: 0 });
 * ```
 */
declare class PositionObserver {
  /**
   * Map of observed targets to their latest `IntersectionObserverEntry`.
   * Use `getEntry(target)` for the same lookup with a method call.
   */
  entries: Map<Element, IntersectionObserverEntry>;
  /**
   * Current package version.
   * @example `"1.1.5"`
   */
  static version: string;
  /** Tick id for the internal `requestAnimationFrame` loop. */
  protected _t: number;
  /** `PositionObserver` root element. Defaults to `document.documentElement`. */
  protected _r: Element;
  /** Cached `root.clientWidth`. */
  protected _w: number;
  /** Cached `root.clientHeight`. */
  protected _h: number;
  /** Forwarded `IntersectionObserver` `rootMargin` option. */
  protected _rm: string | undefined;
  /** Forwarded `IntersectionObserver` `threshold` option. */
  protected _th: number | number[] | undefined;
  /** User-provided callback invoked with position updates. */
  protected _c: PositionObserverCallback;
  /**
   * Create a new `PositionObserver`.
   *
   * @param callback - Called with position updates and the observer instance
   * @param options - Optional root and `IntersectionObserver` forwarding options
   * @throws Error if `callback` is not a function
   */
  constructor(callback: PositionObserverCallback, options?: PositionObserverOptions);
  /**
   * Start observing the position of `target`.
   * No-ops if `target` is not an `Element`, not contained by `root`,
   * or already observed (duplicate entries are ignored).
   *
   * @param target - Element to observe
   * @throws Error if `target` is not an instance of `Element`
   * @returns void
   */
  observe: (target: Element) => void;
  /**
   * Stop observing `target`.
   *
   * @param target - Element to unobserve
   * @returns void
   */
  unobserve: (target: Element) => void;
  /**
   * Internal `requestAnimationFrame` loop.
   * Polls each target via a one-shot `IntersectionObserver`,
   * filters by `isIntersecting` and by `top`/`left` or root size change,
   * then invokes the callback with updates and re-schedules itself.
   *
   * @returns void
   */
  protected _rc: () => void;
  /**
   * Create a one-shot `IntersectionObserver` for `target` and resolve
   * with the first `IntersectionObserverEntry`. The observer is
   * disconnected immediately after the first callback.
   *
   * @param target - Element to observe
   * @returns Promise resolving to the first `IntersectionObserverEntry`
   */
  protected _n: (target: Element) => Promise<IntersectionObserverEntry>;
  /**
   * Get the last `IntersectionObserverEntry` for `target`.
   *
   * @param target - Observed element
   * @returns The stored entry or `undefined` if not observed
   */
  getEntry: (target: Element) => IntersectionObserverEntry | undefined;
  /**
   * Disconnect the observer: cancel the animation frame and clear all entries.
   *
   * @returns void
   */
  disconnect: () => void;
}
//#endregion
export { PositionObserverCallback, PositionObserverOptions, PositionObserver as default };
//# sourceMappingURL=index.d.ts.map