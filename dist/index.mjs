const m = (e) => e != null && typeof e == "object" || !1, p = (e) => m(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, a = (e) => p(e) && e.nodeType === 1 || !1, w = (e) => typeof e == "function" || !1, k = "1.0.2", u = "PositionObserver Error";
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
  constructor(t, s) {
    if (!w(t))
      throw new Error(`${u}: ${t} is not a function.`);
    this.entries = /* @__PURE__ */ new Map(), this._callback = t, this._root = a(s?.root) ? s.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `Element` target
   */
  observe = (t) => {
    if (!a(t))
      throw new Error(
        `${u}: ${t} is not an instance of Element.`
      );
    this._root.contains(t) && this._new(t).then((s) => {
      s && !this.getEntry(t) && this.entries.set(t, s), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
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
    const t = new Promise((s) => {
      const o = [];
      this.entries.forEach(
        ({ target: i, boundingClientRect: n }) => {
          this._root.contains(i) && this._new(i).then(({ boundingClientRect: r, isVisible: c }) => {
            if (!c) return;
            const { left: f, top: _, bottom: l, right: b } = r;
            if (n.top !== _ || n.left !== f || n.right !== b || n.bottom !== l) {
              const h = { target: i, boundingClientRect: r, isVisible: c };
              this.entries.set(i, h), o.push(h);
            }
          });
        }
      ), s(o);
    });
    this._tick = requestAnimationFrame(async () => {
      const s = await t;
      s.length && this._callback(s, this), this._runCallback();
    });
  };
  /**
   * Calculate the target bounding box and determine
   * the value of `isVisible`.
   *
   * @param target an `Element` target
   */
  _new = (t) => new Promise((s) => {
    new IntersectionObserver(
      ([{ boundingClientRect: i, isIntersecting: n }], r) => {
        r.disconnect(), s({
          target: t,
          isVisible: n,
          boundingClientRect: i
        });
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
