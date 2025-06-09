//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const __thednp_shorty = __toESM(require("@thednp/shorty"));

//#region package.json
var version = "1.0.11";

//#endregion
//#region src/index.ts
const errorString = "PositionObserver Error";
/**
* The PositionObserver class is a utility class that observes the position
* of DOM elements and triggers a callback when their position changes.
*/
var PositionObserver = class {
	entries;
	static version = version;
	_tick;
	_root;
	_callback;
	/**
	* The constructor takes two arguments, a `callback`, which is called
	* whenever the position of an observed element changes and an `options` object.
	* The callback function takes an array of `PositionObserverEntry` objects
	* as its only argument, but it's not required.
	*
	* @param callback the callback that applies to all targets of this observer
	* @param options the options of this observer
	*/
	constructor(callback, options) {
		if (!(0, __thednp_shorty.isFunction)(callback)) throw new Error(`${errorString}: ${callback} is not a function.`);
		this.entries = /* @__PURE__ */ new Map();
		this._callback = callback;
		this._root = (0, __thednp_shorty.isElement)(options?.root) ? options.root : document?.documentElement;
		this._tick = 0;
	}
	/**
	* Start observing the position of the specified element.
	* If the element is not currently attached to the DOM,
	* it will NOT be added to the entries.
	*
	* @param target an `Element` target
	*/
	observe = (target) => {
		if (!(0, __thednp_shorty.isElement)(target)) throw new Error(`${errorString}: ${target} is not an instance of Element.`);
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
	};
	/**
	* Stop observing the position of the specified element.
	*
	* @param target an `Element` target
	*/
	unobserve = (target) => {
		/* istanbul ignore else @preserve */
		if (this.entries.has(target)) this.entries.delete(target);
	};
	/**
	* Private method responsible for all the heavy duty,
	* the observer's runtime.
	*/
	_runCallback = () => {
		/* istanbul ignore if @preserve - a guard must be set */
		if (!this.entries.size) {
			this._tick = 0;
			return;
		}
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
	};
	/**
	* Check intersection status and resolve it
	* right away.
	*
	* @param target an `Element` target
	*/
	_new = (target) => {
		return new Promise((resolve) => {
			const intersectionObserver = new IntersectionObserver(([entry], ob) => {
				ob.disconnect();
				resolve(entry);
			});
			intersectionObserver.observe(target);
		});
	};
	/**
	* Find the entry for a given target.
	*
	* @param target an `HTMLElement` target
	*/
	getEntry = (target) => this.entries.get(target);
	/**
	* Immediately stop observing all elements.
	*/
	disconnect = () => {
		cancelAnimationFrame(this._tick);
		this.entries.clear();
		this._tick = 0;
	};
};

//#endregion
module.exports = PositionObserver;
//# sourceMappingURL=index.js.map