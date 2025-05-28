const p = (t) => t != null && typeof t == "object" || !1, d = (t) => p(t) && typeof t.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (e) => t.nodeType === e
) || !1, a = (t) => d(t) && t.nodeType === 1 || !1, k = (t) => typeof t == "function" || !1, v = "1.0.8", f = "PositionObserver Error";
class y {
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
  constructor(e, i) {
    if (!k(e))
      throw new Error(`${f}: ${e} is not a function.`);
    this.entries = /* @__PURE__ */ new Map(), this._callback = e, this._root = a(i?.root) ? i.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `Element` target
   */
  observe = (e) => {
    if (!a(e))
      throw new Error(
        `${f}: ${e} is not an instance of Element.`
      );
    this._root.contains(e) && this._new(e).then(({ boundingClientRect: i }) => {
      if (i && !this.getEntry(e)) {
        const { clientWidth: s, clientHeight: n } = this._root;
        this.entries.set(e, {
          target: e,
          boundingClientRect: i,
          clientWidth: s,
          clientHeight: n
        });
      }
      this._tick || (this._tick = requestAnimationFrame(this._runCallback));
    });
  };
  /**
   * Stop observing the position of the specified element.
   *
   * @param target an `Element` target
   */
  unobserve = (e) => {
    this.entries.has(e) && this.entries.delete(e);
  };
  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  _runCallback = () => {
    if (!this.entries.size) return;
    const { clientWidth: e, clientHeight: i } = this._root, s = new Promise((n) => {
      const o = [];
      this.entries.forEach(
        ({
          target: r,
          boundingClientRect: c,
          clientWidth: u,
          clientHeight: _
        }) => {
          this._root.contains(r) && this._new(r).then(({ boundingClientRect: h, isIntersecting: m }) => {
            if (!m) return;
            const { left: b, top: w } = h;
            if (c.top !== w || c.left !== b || u !== e || _ !== i) {
              const l = {
                target: r,
                boundingClientRect: h,
                clientHeight: i,
                clientWidth: e
              };
              this.entries.set(r, l), o.push(l);
            }
          });
        }
      ), n(o);
    });
    this._tick = requestAnimationFrame(async () => {
      const n = await s;
      n.length && this._callback(n, this), this._runCallback();
    });
  };
  /**
   * Check intersection status and resolve it
   * right away.
   *
   * @param target an `Element` target
   */
  _new = (e) => new Promise((i) => {
    new IntersectionObserver(
      ([n], o) => {
        o.disconnect(), i(n);
      }
    ).observe(e);
  });
  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  getEntry = (e) => this.entries.get(e);
  /**
   * Immediately stop observing all elements.
   */
  disconnect = () => {
    cancelAnimationFrame(this._tick), this.entries.clear(), this._tick = 0;
  };
}
export {
  y as default
};
//# sourceMappingURL=index.mjs.map
