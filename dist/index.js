//#region package.json
var version = "1.1.6";
//#endregion
//#region src/index.ts
/** Error prefix for all thrown errors. */
const errorString = "PositionObserver Error";
/** Package version from `package.json`. */
const pkgVersion = version;
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
var PositionObserver = class {
	/**
	* Map of observed targets to their latest `IntersectionObserverEntry`.
	* Use `getEntry(target)` for the same lookup with a method call.
	*/
	entries;
	/**
	* Current package version.
	* @example `"1.1.5"`
	*/
	static version = pkgVersion;
	/** Tick id for the internal `requestAnimationFrame` loop. */
	_t;
	/** `PositionObserver` root element. Defaults to `document.documentElement`. */
	_r;
	/** Cached `root.clientWidth`. */
	_w;
	/** Cached `root.clientHeight`. */
	_h;
	/** Forwarded `IntersectionObserver` `rootMargin` option. */
	_rm;
	/** Forwarded `IntersectionObserver` `threshold` option. */
	_th;
	/** User-provided callback invoked with position updates. */
	_c;
	/**
	* Create a new `PositionObserver`.
	*
	* @param callback - Called with position updates and the observer instance
	* @param options - Optional root and `IntersectionObserver` forwarding options
	* @throws Error if `callback` is not a function
	*/
	constructor(callback, options) {
		if (typeof callback !== "function") throw new Error(`${errorString}: ${callback} is not a function.`);
		this.entries = /* @__PURE__ */ new Map();
		this._c = callback;
		this._t = 0;
		const root = options?.root instanceof Element ? options.root : document.documentElement;
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
	observe = (target) => {
		if (!(target instanceof Element)) throw new Error(`${errorString}: ${target} is not an instance of Element.`);
		/* istanbul ignore else @preserve - a guard must be set */
		if (!this._r.contains(target)) return;
		this._n(target).then((ioEntry) => {
			/* istanbul ignore else @preserve - don't allow duplicate entries */
			if (ioEntry.boundingClientRect && !this.getEntry(target)) this.entries.set(target, ioEntry);
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
	unobserve = (target) => {
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
	_rc = () => {
		/* istanbul ignore if @preserve - a guard must be set */
		if (!this.entries.size) {
			this._t = 0;
			return;
		}
		const { clientWidth, clientHeight } = this._r;
		const queue = new Promise((resolve) => {
			const updates = [];
			this.entries.forEach(({ target, boundingClientRect: oldBoundingBox }) => {
				/* istanbul ignore if @preserve - a guard must be set when target has been removed */
				if (!(target instanceof Element) || !target.isConnected) return;
				this._n(target).then((ioEntry) => {
					/* istanbul ignore if @preserve - make sure to only count visible entries */
					if (!ioEntry.isIntersecting) return;
					const { left, top } = ioEntry.boundingClientRect;
					/* istanbul ignore else @preserve - only schedule entries that changed position */
					if (oldBoundingBox.top !== top || oldBoundingBox.left !== left || this._w !== clientWidth || this._h !== clientHeight) {
						this.entries.set(target, ioEntry);
						updates.push(ioEntry);
					}
				});
			});
			this._w = clientWidth;
			this._h = clientHeight;
			resolve(updates);
		});
		this._t = requestAnimationFrame(async () => {
			const updates = await queue;
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
	_n = (target) => {
		return new Promise((resolve) => {
			new IntersectionObserver(([ioEntry], ob) => {
				ob.disconnect();
				resolve(ioEntry);
			}, {
				threshold: this._th,
				rootMargin: this._rm
			}).observe(target);
		});
	};
	/**
	* Get the last `IntersectionObserverEntry` for `target`.
	*
	* @param target - Observed element
	* @returns The stored entry or `undefined` if not observed
	*/
	getEntry = (target) => this.entries.get(target);
	/**
	* Disconnect the observer: cancel the animation frame and clear all entries.
	*
	* @returns void
	*/
	disconnect = () => {
		cancelAnimationFrame(this._t);
		this.entries.clear();
		this._t = 0;
	};
};
//#endregion
export { PositionObserver as default };

//# sourceMappingURL=index.js.map