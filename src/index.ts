import pkg from "../package.json" with { type: "json" };

/**
 * Callback invoked when observed element positions change.
 *
 * @param entries - Array of `IntersectionObserverEntry` objects whose
 * `boundingClientRect` changed or whose root size changed
 * @param observer - The `PositionObserver` instance that triggered the callback
 * @returns void
 */
export type PositionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: PositionObserver,
) => void;

/**
 * Options for the `PositionObserver` constructor.
 *
 * `root` is the `PositionObserver` root only — the internal
 * `IntersectionObserver` always uses `document` as root.
 * `rootMargin` and `threshold` are forwarded to that `IntersectionObserver`
 * and only affect the `isIntersecting` gate.
 */
export type PositionObserverOptions = {
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

/** Error prefix for all thrown errors. */
const errorString: string = "PositionObserver Error";
/** Package version from `package.json`. */
const pkgVersion: string = (pkg as { version: string }).version;

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
export default class PositionObserver {
  /**
   * Map of observed targets to their latest `IntersectionObserverEntry`.
   * Use `getEntry(target)` for the same lookup with a method call.
   */
  public entries: Map<Element, IntersectionObserverEntry>;

  /**
   * Current package version.
   * @example `"1.1.5"`
   */
  public static version: string = pkgVersion;

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
  constructor(
    callback: PositionObserverCallback,
    options?: PositionObserverOptions,
  ) {
    if (typeof callback !== "function") {
      throw new Error(`${errorString}: ${callback} is not a function.`);
    }
    this.entries = new Map<Element, IntersectionObserverEntry>();
    this._c = callback;
    this._t = 0;
    const root: Element = (options?.root instanceof Element)
      ? options.root
      /* istanbul ignore next @preserve */
      : document.documentElement as Element;
    this._r = root;
    this._rm = options?.rootMargin;
    this._th = options?.threshold;

    this._w = root.clientWidth;
    this._h = root.clientHeight;
  }

  /**
   * Start observing the position of `target`.
   * No-ops if `target` is not an `Element`, not contained by `root`,
   * or already observed (duplicate entries are ignored).
   *
   * @param target - Element to observe
   * @throws Error if `target` is not an instance of `Element`
   * @returns void
   */
  public observe = (target: Element): void => {
    if (!(target instanceof Element)) {
      throw new Error(
        `${errorString}: ${target} is not an instance of Element.`,
      );
    }

    /* istanbul ignore else @preserve - a guard must be set */
    if (!this._r.contains(target)) return;

    // define a new entry
    // push the entry into the queue
    this._n(target).then((ioEntry: IntersectionObserverEntry): void => {
      /* istanbul ignore else @preserve - don't allow duplicate entries */
      if (ioEntry.boundingClientRect && !this.getEntry(target)) {
        this.entries.set(target, ioEntry);
      }

      /* istanbul ignore else @preserve */
      if (!this._t) this._t = requestAnimationFrame(this._rc);
    });
  };

  /**
   * Stop observing `target`.
   *
   * @param target - Element to unobserve
   * @returns void
   */
  public unobserve = (target: Element): void => {
    /* istanbul ignore else @preserve */
    if (this.entries.has(target)) this.entries.delete(target);
  };

  /**
   * Internal `requestAnimationFrame` loop.
   * Polls each target via a one-shot `IntersectionObserver`,
   * filters by `isIntersecting` and by `top`/`left` or root size change,
   * then invokes the callback with updates and re-schedules itself.
   *
   * @returns void
   */
  protected _rc = (): void => {
    /* istanbul ignore if @preserve - a guard must be set */
    if (!this.entries.size) {
      this._t = 0;
      return;
    }
    const { clientWidth, clientHeight }: Element = this._r;

    const queue: Promise<IntersectionObserverEntry[]> = new Promise<
      IntersectionObserverEntry[]
    >(
      (resolve: (value: IntersectionObserverEntry[]) => void): void => {
        const updates: IntersectionObserverEntry[] = [];
        this.entries.forEach(
          (
            { target, boundingClientRect: oldBoundingBox }:
              IntersectionObserverEntry,
          ): void => {
            /* istanbul ignore if @preserve - a guard must be set when target has been removed */
            if (!(target instanceof Element) || !target.isConnected) return;

            this._n(target as Element).then(
              (ioEntry: IntersectionObserverEntry): void => {
                /* istanbul ignore if @preserve - make sure to only count visible entries */
                if (!ioEntry.isIntersecting) return;

                const { left, top }: DOMRectReadOnly =
                  ioEntry.boundingClientRect;

                /* istanbul ignore else @preserve - only schedule entries that changed position */
                if (
                  oldBoundingBox.top !== top || oldBoundingBox.left !== left ||
                  this._w !== clientWidth || this._h !== clientHeight
                ) {
                  this.entries.set(target as Element, ioEntry);
                  updates.push(ioEntry);
                }
              },
            );
          },
        );
        // update root client width & height
        this._w = clientWidth;
        this._h = clientHeight;

        resolve(updates);
      },
    );

    this._t = requestAnimationFrame(async (): Promise<void> => {
      // execute the queue
      const updates: IntersectionObserverEntry[] = await queue;

      // only execute the callback if position actually changed
      /* istanbul ignore else @preserve */
      if (updates.length) this._c(updates, this);

      this._rc();
    });
  };

  /**
   * Create a one-shot `IntersectionObserver` for `target` and resolve
   * with the first `IntersectionObserverEntry`. The observer is
   * disconnected immediately after the first callback.
   *
   * @param target - Element to observe
   * @returns Promise resolving to the first `IntersectionObserverEntry`
   */
  protected _n = (target: Element): Promise<IntersectionObserverEntry> => {
    return new Promise<IntersectionObserverEntry>(
      (resolve: (value: IntersectionObserverEntry) => void): void => {
        const intersectionObserver: IntersectionObserver =
          new IntersectionObserver(
            (
              [ioEntry]: IntersectionObserverEntry[],
              ob: IntersectionObserver,
            ): void => {
              ob.disconnect();
              resolve(ioEntry as IntersectionObserverEntry);
            },
            {
              // IntersectionObserver.root is always the document
              // root: target.ownerDocument || document,
              threshold: this._th,
              rootMargin: this._rm,
            } as IntersectionObserverInit,
          );

        intersectionObserver.observe(target);
      },
    );
  };

  /**
   * Get the last `IntersectionObserverEntry` for `target`.
   *
   * @param target - Observed element
   * @returns The stored entry or `undefined` if not observed
   */
  public getEntry = (target: Element): IntersectionObserverEntry | undefined =>
    this.entries.get(target);

  /**
   * Disconnect the observer: cancel the animation frame and clear all entries.
   *
   * @returns void
   */
  public disconnect = (): void => {
    cancelAnimationFrame(this._t);
    this.entries.clear();
    this._t = 0;
  };
}
