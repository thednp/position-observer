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
var version = "1.1.0";

//#endregion
//#region src/index.ts
const callbackModes = [
	"all",
	"intersecting",
	"update"
];
const errorString = "PositionObserver Error";
/**
* The PositionObserver class is a utility class that observes the position
* of DOM elements and triggers a callback when their position changes.
*/
var PositionObserver = class {
	entries;
	static version = version;
	/** `PositionObserver.tick` */
	_t;
	/** `PositionObserver.root` */
	_r;
	/** `PositionObserver.callbackMode` */
	_cm;
	/** `PositionObserver.root.clientWidth` */
	_w;
	/** `PositionObserver.root.clientHeight` */
	_h;
	/** `IntersectionObserver.options.rootMargin` */
	_rm;
	/** `IntersectionObserver.options.threshold` */
	_th;
	/** `PositionObserver.callback` */
	_c;
	/**
	* The constructor takes two arguments, a `callback`, which is called
	* whenever the position of an observed element changes and an `options` object.
	* The callback function takes an array of `PositionObserverEntry` objects
	* as its first argument and the PositionObserver instance as its second argument.
	*
	* @param callback the callback that applies to all targets of this observer
	* @param options the options of this observer
	*/
	constructor(callback, options) {
		if (!(0, __thednp_shorty.isFunction)(callback)) throw new Error(`${errorString}: ${callback} is not a function.`);
		this.entries = /* @__PURE__ */ new Map();
		this._c = callback;
		this._t = 0;
		const root = (0, __thednp_shorty.isElement)(options?.root) ? options.root : document?.documentElement;
		this._r = root;
		this._rm = options?.rootMargin;
		this._th = options?.threshold;
		/* istanbul ignore next @preserve */
		this._cm = callbackModes.indexOf(options?.callbackMode || "intersecting");
		this._w = root.clientWidth;
		this._h = root.clientHeight;
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
		if (!this._r.contains(target)) return;
		this._n(target).then((ioEntry) => {
			/* istanbul ignore else @preserve - don't allow duplicate entries */
			if (ioEntry.boundingClientRect && !this.getEntry(target)) this.entries.set(target, ioEntry);
			/* istanbul ignore else @preserve */
			if (!this._t) this._t = requestAnimationFrame(this._rc);
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
	* `PositionObserver.runCallback`
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
			this.entries.forEach(({ target, boundingClientRect: oldBoundingBox, isIntersecting: oldIsIntersecting }) => {
				/* istanbul ignore if @preserve - a guard must be set when target has been removed */
				if (!this._r.contains(target)) return;
				this._n(target).then((ioEntry) => {
					/* istanbul ignore if @preserve - make sure to only count visible entries */
					if (!ioEntry.isIntersecting) {
						if (this._cm === 1) return;
						else if (this._cm === 2) {
							if (oldIsIntersecting) {
								this.entries.set(target, ioEntry);
								updates.push(ioEntry);
							}
							return;
						}
					}
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
	* Check intersection status and resolve it
	* right away.
	*
	* `PositionObserver.newEntryForTarget`
	*
	* @param target an `Element` target
	*/
	_n = (target) => {
		return new Promise((resolve) => {
			const intersectionObserver = new IntersectionObserver(([ioEntry], ob) => {
				ob.disconnect();
				resolve(ioEntry);
			}, {
				threshold: this._th,
				rootMargin: this._rm
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
		cancelAnimationFrame(this._t);
		this.entries.clear();
		this._t = 0;
	};
};

//#endregion
module.exports = PositionObserver;
//# sourceMappingURL=index.js.map