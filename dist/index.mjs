const T = (e) => e != null && typeof e == "object" || !1, d = (e) => T(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, _ = (e) => d(e) && e.nodeType === 1 || !1, g = (e) => typeof e == "function" || !1, p = "PositionObserver Error";
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
  constructor(t, s) {
    if (!g(t))
      throw new Error(`${p}: ${t} is not a function.`);
    this.entries = [], this._callback = t, this._root = _(s?.root) ? s.root : document?.documentElement, this._tick = 0;
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
        `${p}: ${t} is not an instance of HTMLElement.`
      );
    if (!this._root.contains(t)) return;
    const s = this._getTargetEntry(t);
    this.entries.push(s), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
  };
  /**
   * Stop observing the position of the specified element.
   * @param target
   */
  unobserve = (t) => {
    const s = this.entries.findIndex((i) => i.target === t);
    this.entries.splice(s, 1);
  };
  /**
   * Private method responsible for all the heavy duty.
   */
  _runCallback = () => {
    if (!this.entries.length) return;
    const t = [];
    this.entries.forEach((s, i) => {
      const { target: r, box: o } = s;
      if (!this._root.contains(r)) return;
      const { box: n, isVisible: c } = this._getTargetEntry(r), {
        offsetLeft: f,
        offsetTop: l,
        offsetWidth: h,
        offsetHeight: a,
        scrollLeft: u,
        scrollTop: b
      } = n;
      (o.offsetLeft !== f || o.offsetTop !== l || o.offsetWidth !== h || o.offsetHeight !== a || o.scrollTop !== b || o.scrollLeft !== u) && (this.entries[i].box = n, this.entries[i].isVisible = c, t.push({ target: r, box: n, isVisible: c }));
    }), t.length && this._callback(t), requestAnimationFrame(this._runCallback);
  };
  _getTargetEntry = (t) => {
    const {
      offsetLeft: s,
      offsetTop: i,
      offsetWidth: r,
      offsetHeight: o,
      scrollTop: n,
      scrollLeft: c
    } = t, {
      clientWidth: f,
      clientHeight: l,
      scrollLeft: h,
      scrollTop: a
    } = this._root, u = i > 1 - o && s > 1 - r && i + o <= l + o - 1 && s + r <= f + r - 1;
    return {
      target: t,
      isVisible: u,
      box: {
        offsetLeft: s,
        offsetTop: i,
        offsetWidth: r,
        offsetHeight: o,
        scrollLeft: c + h,
        scrollTop: n + a
      }
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
