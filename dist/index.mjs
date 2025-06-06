import { isElement, isFunction } from "@thednp/shorty";
import _defineProperty from "@oxc-project/runtime/helpers/defineProperty";

//#region package.json
var version = "1.0.9";

//#endregion
//#region src/index.ts
const errorString = "PositionObserver Error";
/**
* The PositionObserver class is a utility class that observes the position
* of DOM elements and triggers a callback when their position changes.
*/
var PositionObserver = class {
	/**
	* The constructor takes two arguments, a `callback`, which is called
	* whenever the position of an observed element changes and an `options` object.
	* The callback function should take an array of `PositionObserverEntry` objects
	* as its only argument, but it's not required.
	*
	* @param callback the callback that applies to all targets of this observer
	* @param options the options of this observer
	*/
	constructor(callback, options) {
		_defineProperty(this, "entries", void 0);
		_defineProperty(this, "_tick", void 0);
		_defineProperty(this, "_root", void 0);
		_defineProperty(this, "_callback", void 0);
		_defineProperty(this, "observe", (target) => {
			if (!isElement(target)) throw new Error(`${errorString}: ${target} is not an instance of Element.`);
			/* istanbul ignore else @preserve - a guard must be set */
			if (!this._root.contains(target)) return;
			this._new(target).then(({ boundingClientRect }) => {
				/* istanbul ignore else @preserve - don't allow duplicate entries */
				if (boundingClientRect && !this.getEntry(target)) {
					const { clientWidth, clientHeight } = this._root;
					this.entries.set(target, {
						target,
						boundingClientRect,
						clientWidth,
						clientHeight
					});
				}
				/* istanbul ignore else @preserve */
				if (!this._tick) this._tick = requestAnimationFrame(this._runCallback);
			});
		});
		_defineProperty(this, "unobserve", (target) => {
			/* istanbul ignore else @preserve */
			if (this.entries.has(target)) this.entries.delete(target);
		});
		_defineProperty(this, "_runCallback", () => {
			/* istanbul ignore if @preserve - a guard must be set */
			if (!this.entries.size) return;
			const { clientWidth, clientHeight } = this._root;
			const queue = new Promise((resolve) => {
				const updates = [];
				this.entries.forEach(({ target, boundingClientRect: oldBoundingBox, clientWidth: oldWidth, clientHeight: oldHeight }) => {
					/* istanbul ignore if @preserve - a guard must be set when target has been removed */
					if (!this._root.contains(target)) return;
					this._new(target).then(({ boundingClientRect, isIntersecting }) => {
						/* istanbul ignore if @preserve - make sure to only count visible entries */
						if (!isIntersecting) return;
						const { left, top } = boundingClientRect;
						/* istanbul ignore else @preserve - only schedule entries that changed position */
						if (oldBoundingBox.top !== top || oldBoundingBox.left !== left || oldWidth !== clientWidth || oldHeight !== clientHeight) {
							const newEntry = {
								target,
								boundingClientRect,
								clientHeight,
								clientWidth
							};
							this.entries.set(target, newEntry);
							updates.push(newEntry);
						}
					});
				});
				resolve(updates);
			});
			this._tick = requestAnimationFrame(async () => {
				const updates = await queue;
				/* istanbul ignore else @preserve */
				if (updates.length) this._callback(updates, this);
				this._runCallback();
			});
		});
		_defineProperty(this, "_new", (target) => {
			return new Promise((resolve) => {
				const intersectionObserver = new IntersectionObserver(([entry], ob) => {
					ob.disconnect();
					resolve(entry);
				});
				intersectionObserver.observe(target);
			});
		});
		_defineProperty(this, "getEntry", (target) => this.entries.get(target));
		_defineProperty(this, "disconnect", () => {
			cancelAnimationFrame(this._tick);
			this.entries.clear();
			this._tick = 0;
		});
		if (!isFunction(callback)) throw new Error(`${errorString}: ${callback} is not a function.`);
		this.entries = /* @__PURE__ */ new Map();
		this._callback = callback;
		this._root = isElement(options?.root) ? options.root : document?.documentElement;
		this._tick = 0;
	}
};
_defineProperty(PositionObserver, "version", version);

//#endregion
export { PositionObserver as default };
//# sourceMappingURL=index.mjs.map