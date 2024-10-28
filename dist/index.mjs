const g = (i) => i != null && typeof i == "object" || !1, _ = (i) => g(i) && typeof i.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => i.nodeType === t
) || !1, b = (i) => _(i) && i.nodeType === 1 || !1, d = (i) => typeof i == "function" || !1, f = "PositionObserver Error";
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
  constructor(t, n) {
    if (!d(t))
      throw new Error(`${f}: ${t} is not a function.`);
    this.entries = [], this._callback = t, this._root = b(n?.root) ? n.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   * @param target
   */
  observe = (t) => {
    if (!b(t))
      throw new Error(
        `${f}: ${t} is not an instance of HTMLElement.`
      );
    if (!this._root.contains(t)) return;
    const n = this._getTargetEntry(t);
    this.entries.push(n), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
  };
  /**
   * Stop observing the position of the specified element.
   * @param target
   */
  unobserve = (t) => {
    const n = this.entries.findIndex((e) => e.target === t);
    this.entries.splice(n, 1);
  };
  /**
   * Private method responsible for all the heavy duty.
   */
  _runCallback = () => {
    if (!this.entries.length) return;
    const t = [];
    this.entries.forEach((n, e) => {
      const { target: o, boundingBox: s } = n;
      if (!this._root.contains(o)) return;
      const { boundingBox: r, isVisible: c } = this._getTargetEntry(o), { left: u, top: h, bottom: l, right: a } = r;
      (s.left !== u || s.top !== h || s.right !== a || s.bottom !== l) && (this.entries[e].boundingBox = r, this.entries[e].isVisible = c, t.push({ target: o, boundingBox: r, isVisible: c }));
    }), t.length && this._callback(t), requestAnimationFrame(this._runCallback);
  };
  _getTargetEntry = (t) => {
    const { clientWidth: n, clientHeight: e } = this._root, o = t.getBoundingClientRect(), { left: s, top: r, bottom: c, right: u, width: h, height: l } = o, a = r > 1 - l && s > 1 - h && c <= e + l - 1 && u <= n + h - 1;
    return {
      target: t,
      isVisible: a,
      boundingBox: o
    };
  };
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
