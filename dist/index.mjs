const p = (e) => e != null && typeof e == "object" || !1, d = (e) => p(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, a = (e) => d(e) && e.nodeType === 1 || !1, k = (e) => typeof e == "function" || !1, v = "1.0.7", u = "PositionObserver Error";
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
  constructor(t, i) {
    if (!k(t))
      throw new Error(`${u}: ${t} is not a function.`);
    this.entries = /* @__PURE__ */ new Map(), this._callback = t, this._root = a(i?.root) ? i.root : document?.documentElement, this._tick = 0;
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
    this._root.contains(t) && this._new(t).then(({ boundingClientRect: i }) => {
      if (i && !this.getEntry(t)) {
        const { clientWidth: s, clientHeight: n } = this._root;
        this.entries.set(t, {
          target: t,
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
  unobserve = (t) => {
    this.entries.has(t) && this.entries.delete(t);
  };
  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  _runCallback = () => {
    if (!this.entries.size) return;
    const { clientWidth: t, clientHeight: i } = this._root, s = new Promise((n) => {
      const o = [];
      this.entries.forEach(
        ({
          target: r,
          boundingClientRect: c,
          clientWidth: _,
          clientHeight: f
        }) => {
          this._root.contains(r) && this._new(r).then(({ boundingClientRect: h, isIntersecting: m }) => {
            if (!m) return;
            const { left: b, top: w } = h;
            if (c.top !== w || c.left !== b || _ !== t || f !== i) {
              const l = {
                target: r,
                boundingClientRect: h,
                clientHeight: i,
                clientWidth: t
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
  _new = (t) => new Promise((i) => {
    new IntersectionObserver(
      ([n], o) => {
        o.disconnect(), i(n);
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
  y as default
};
//# sourceMappingURL=index.mjs.map
