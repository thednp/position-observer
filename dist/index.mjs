const p = (i) => i != null && typeof i == "object" || !1, k = (i) => p(i) && typeof i.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => i.nodeType === t
) || !1, _ = (i) => k(i) && i.nodeType === 1 || !1, B = (i) => typeof i == "function" || !1, m = "PositionObserver Error";
class x {
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
  constructor(t, n) {
    if (!B(t))
      throw new Error(`${m}: ${t} is not a function.`);
    this.entries = [], this._callback = t, this._root = _(n?.root) ? n.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   * @param target
   */
  observe = (t) => {
    if (!_(t))
      throw new Error(
        `${m}: ${t} is not an instance of HTMLElement.`
      );
    if (!this._root.contains(t)) return;
    const { clientWidth: n, clientHeight: o } = this._root, h = t.getBoundingClientRect(), { left: l, top: u, bottom: e, right: s, width: r, height: c } = h, a = u > 1 - c && l > 1 - r && e <= o + c - 1 && s <= n + r - 1;
    this.entries.push({ target: t, boundingBox: h, isVisible: a }), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
  };
  /**
   * Stop observing the position of the specified element.
   * @param target
   */
  unobserve = (t) => {
    const n = this.entries.findIndex((o) => o.target === t);
    this.entries.splice(n, 1);
  };
  /**
   * Private method responsible for all the heavy duty.
   */
  _runCallback = () => {
    if (!this.entries.length) return;
    const t = [], { clientWidth: n, clientHeight: o } = this._root;
    this.entries.forEach((h, l) => {
      const { target: u, boundingBox: e } = h, s = u.getBoundingClientRect(), { left: r, top: c, bottom: a, right: d, width: b, height: f } = s;
      if (e.left !== r || e.top !== c || e.right !== d || e.bottom !== a) {
        const g = c > 1 - f && r > 1 - b && a <= o + f - 1 && d <= n + b - 1;
        this.entries[l].boundingBox = s, this.entries[l].isVisible = g, t.push({ target: u, boundingBox: s, isVisible: g });
      }
    }), t.length && this._callback(t), requestAnimationFrame(this._runCallback);
  };
  /**
   * Immediately stop observing all elements.
   */
  disconnect = () => {
    cancelAnimationFrame(this._tick), this.entries.length = 0, this._tick = 0;
  };
}
export {
  x as default
};
//# sourceMappingURL=index.mjs.map
