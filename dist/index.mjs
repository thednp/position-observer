const m = (e) => e != null && typeof e == "object" || !1, p = (e) => m(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, h = (e) => p(e) && e.nodeType === 1 || !1, w = (e) => typeof e == "function" || !1, k = "1.0.3", a = "PositionObserver Error";
class v {
  entries;
  static version = k;
  _tick;
  _root;
  _callback;
  /**
   * The constructor takes two arguments, a `callback`, which is called
   * whenever the position of an observed element changes and an `options` object.
   * The callback function should take an array of `PositionObserverEntry` objects
   * as its only argument, but it's not required.
   *
   * @param callback the callback that applies to all targets of this observer
   * @param options the options of this observer
   */
  constructor(t, i) {
    if (!w(t))
      throw new Error(`${a}: ${t} is not a function.`);
    this.entries = /* @__PURE__ */ new Map(), this._callback = t, this._root = h(i?.root) ? i.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `Element` target
   */
  observe = (t) => {
    if (!h(t))
      throw new Error(
        `${a}: ${t} is not an instance of Element.`
      );
    this._root.contains(t) && this._new(t).then((i) => {
      i && !this.getEntry(t) && this.entries.set(t, i), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
    });
  };
  /**
   * Stop observing the position of the specified element.
   *
   * @param target an `HTMLElement` target
   */
  unobserve = (t) => {
    this.entries.has(t) && this.entries.delete(t);
  };
  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  _runCallback = () => {
    if (!this.entries.size) return;
    const t = new Promise((i) => {
      const r = [];
      this.entries.forEach(
        ({ target: s, boundingClientRect: n }) => {
          this._root.contains(s) && this._new(s).then(({ boundingClientRect: o, isIntersecting: u }) => {
            if (!u) return;
            const { left: f, top: _, bottom: l, right: b } = o;
            if (n.top !== _ || n.left !== f || n.right !== b || n.bottom !== l) {
              const c = { target: s, boundingClientRect: o };
              this.entries.set(s, c), r.push(c);
            }
          });
        }
      ), i(r);
    });
    this._tick = requestAnimationFrame(async () => {
      const i = await t;
      i.length && this._callback(i, this), this._runCallback();
    });
  };
  /**
   * Calculate the target bounding box and determine
   * the value of `isVisible`.
   *
   * @param target an `Element` target
   */
  _new = (t) => new Promise((i) => {
    new IntersectionObserver(
      ([s], n) => {
        n.disconnect(), i(s);
      }
    ).observe(t);
  });
  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  getEntry = (t) => this.entries.get(t);
  /**
   * Immediately stop observing all elements.
   */
  disconnect = () => {
    cancelAnimationFrame(this._tick), this.entries.clear(), this._tick = 0;
  };
}
export {
  v as default
};
//# sourceMappingURL=index.mjs.map
