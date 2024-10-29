const _ = (n) => n != null && typeof n == "object" || !1, d = (n) => _(n) && typeof n.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => n.nodeType === t
) || !1, f = (n) => d(n) && n.nodeType === 1 || !1, g = (n) => typeof n == "function" || !1, b = "PositionObserver Error";
class m {
  entries;
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
    if (!g(t))
      throw new Error(`${b}: ${t} is not a function.`);
    this.entries = [], this._callback = t, this._root = f(i?.root) ? i.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   *
   * @param target an `HTMLElement` target
   */
  observe = (t) => {
    if (!f(t))
      throw new Error(
        `${b}: ${t} is not an instance of HTMLElement.`
      );
    if (!this._root.contains(t) || this.getEntry(t)) return;
    const i = this._new(t);
    this.entries.push(i), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
  };
  /**
   * Stop observing the position of the specified element.
   *
   * @param target an `HTMLElement` target
   */
  unobserve = (t) => {
    const i = this.entries.findIndex((e) => e.target === t);
    i > -1 && this.entries.splice(i, 1);
  };
  /**
   * Private method responsible for all the heavy duty,
   * the observer's runtime.
   */
  _runCallback = () => {
    if (!this.entries.length) return;
    const t = [];
    this.entries.forEach((i, e) => {
      const { target: o, boundingBox: s } = i;
      if (!this._root.contains(o)) return;
      const { boundingBox: r, isVisible: c } = this._new(o), { left: u, top: h, bottom: l, right: a } = r;
      (s.left !== u || s.top !== h || s.right !== a || s.bottom !== l) && (this.entries[e].boundingBox = r, this.entries[e].isVisible = c, t.push({ target: o, boundingBox: r, isVisible: c }));
    }), t.length && this._callback(t), requestAnimationFrame(this._runCallback);
  };
  /**
   * Calculate the target bounding box and determine
   * the value of `isVisible`.
   *
   * @param target an `HTMLElement` target
   */
  _new = (t) => {
    const { clientWidth: i, clientHeight: e } = this._root, o = t.getBoundingClientRect(), { left: s, top: r, bottom: c, right: u, width: h, height: l } = o, a = r > 1 - l && s > 1 - h && c <= e + l - 1 && u <= i + h - 1;
    return {
      target: t,
      isVisible: a,
      boundingBox: o
    };
  };
  /**
   * Find the entry for a given target.
   *
   * @param target an `HTMLElement` target
   */
  getEntry = (t) => this.entries.find((i) => i.target === t);
  /**
   * Immediately stop observing all elements.
   */
  disconnect = () => {
    cancelAnimationFrame(this._tick), this.entries.length = 0, this._tick = 0;
  };
}
export {
  m as default
};
//# sourceMappingURL=index.mjs.map
