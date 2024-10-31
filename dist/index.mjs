const v = (e) => e != null && typeof e == "object" || !1, y = (e) => v(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, m = (e) => y(e) && e.nodeType === 1 || !1, k = (e) => typeof e == "function" || !1, E = "1.0.0", s = /* @__PURE__ */ new Map(), p = "PositionObserver Error";
class O {
  static entries = s;
  static version = E;
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
    if (!k(t))
      throw new Error(`${p}: ${t} is not a function.`);
    this._callback = t, this._root = m(i?.root) ? i.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `HTMLElement` target
   */
  observe = (t) => {
    if (!m(t))
      throw new Error(
        `${p}: ${t} is not an instance of HTMLElement.`
      );
    this._root.contains(t) && this._new(t).then((i) => {
      this.getEntry(t) || s.set(t, i), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
    });
  };
  /**
   * Stop observing the position of the specified element.
   *
   * @param target an `HTMLElement` target
   */
  unobserve = (t) => {
    s.has(t) && s.delete(t);
  };
  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  _runCallback = () => {
    if (!s.size) return;
    const t = new Promise((i) => {
      const h = [];
      s.forEach(
        async ({ target: n, boundingClientRect: o }) => {
          this._root.contains(n) && await this._new(n).then(({ boundingClientRect: r, isVisible: a }) => {
            const { left: f, top: l, bottom: u, right: _ } = r;
            if (o.top !== l || o.left !== f || o.right !== _ || o.bottom !== u) {
              const c = { target: n, boundingClientRect: r, isVisible: a };
              s.set(n, c), h.push(c);
            }
          });
        }
      ), i(h);
    });
    requestAnimationFrame(async () => {
      const i = await t;
      i.length && this._callback(i, this), this._runCallback();
    });
  };
  /**
   * Calculate the target bounding box and determine
   * the value of `isVisible`.
   *
   * @param target an `HTMLElement` target
   */
  _new = (t) => {
    const { clientWidth: i, clientHeight: h } = this._root;
    return new Promise((n) => {
      new IntersectionObserver(
        ([{ boundingClientRect: r }], a) => {
          a.disconnect();
          const { left: f, top: l, bottom: u, right: _, width: c, height: b } = r, w = l > 1 - b && f > 1 - c && u <= h + b - 1 && _ <= i + c - 1;
          n({
            target: t,
            isVisible: w,
            boundingClientRect: r
          });
        }
      ).observe(t);
    });
  };
  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  getEntry = (t) => s.get(t);
  /**
   * Immediately stop observing all elements.
   */
  disconnect = () => {
    cancelAnimationFrame(this._tick), s.clear(), this._tick = 0;
  };
}
export {
  O as default
};
//# sourceMappingURL=index.mjs.map
