const p = (e) => e != null && typeof e == "object" || !1, y = (e) => p(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, b = (e) => y(e) && e.nodeType === 1 || !1, k = (e) => typeof e == "function" || !1, v = "1.0.0", m = "PositionObserver Error";
class E {
  entries;
  static version = v;
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
      throw new Error(`${m}: ${t} is not a function.`);
    this.entries = /* @__PURE__ */ new Map(), this._callback = t, this._root = b(i?.root) ? i.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `HTMLElement` target
   */
  observe = (t) => {
    if (!b(t))
      throw new Error(
        `${m}: ${t} is not an instance of HTMLElement.`
      );
    this._root.contains(t) && this._new(t).then((i) => {
      this.getEntry(t) || this.entries.set(t, i), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
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
      const c = [];
      this.entries.forEach(
        async ({ target: s, boundingClientRect: n }) => {
          this._root.contains(s) && await this._new(s).then(({ boundingClientRect: r, isVisible: h }) => {
            const { left: a, top: f, bottom: l, right: u } = r;
            if (n.top !== f || n.left !== a || n.right !== u || n.bottom !== l) {
              const o = { target: s, boundingClientRect: r, isVisible: h };
              this.entries.set(s, o), c.push(o);
            }
          });
        }
      ), i(c);
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
    const { clientWidth: i, clientHeight: c } = this._root;
    return new Promise((s) => {
      new IntersectionObserver(
        ([{ boundingClientRect: r }], h) => {
          h.disconnect();
          const { left: a, top: f, bottom: l, right: u, width: o, height: _ } = r, w = f > 1 - _ && a > 1 - o && l <= c + _ - 1 && u <= i + o - 1;
          s({
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
  getEntry = (t) => this.entries.get(t);
  /**
   * Immediately stop observing all elements.
   */
  disconnect = () => {
    cancelAnimationFrame(this._tick), this.entries.clear(), this._tick = 0;
  };
}
export {
  E as default
};
//# sourceMappingURL=index.mjs.map
