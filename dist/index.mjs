const T = (e) => e != null && typeof e == "object" || !1, d = (e) => T(e) && typeof e.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (t) => e.nodeType === t
) || !1, a = (e) => d(e) && e.nodeType === 1 || !1, g = (e) => typeof e == "function" || !1, u = "PositionObserver Error";
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
      throw new Error(`${u}: ${t} is not a function.`);
    this.entries = [], this._callback = t, this._root = a(s?.root) ? s.root : document?.documentElement, this._tick = 0;
  }
  /**
   * Start observing the position of the specified element.
   * If the element is not currently attached to the DOM,
   * it will NOT be added to the entries.
   * @param target
   */
  observe = (t) => {
    if (!a(t))
      throw new Error(
        `${u}: ${t} is not an instance of HTMLElement.`
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
    const s = this.entries.findIndex((o) => o.target === t);
    this.entries.splice(s, 1);
  };
  /**
   * Private method responsible for all the heavy duty.
   */
  _runCallback = () => {
    if (!this.entries.length) return;
    const t = [];
    this.entries.forEach((s, o) => {
      const { target: n, box: i } = s;
      if (!this._root.contains(n)) return;
      const { box: r, isVisible: c } = this._getTargetEntry(n), {
        offsetLeft: f,
        offsetTop: h,
        offsetWidth: l,
        offsetHeight: _,
        scrollLeft: b,
        scrollTop: p
      } = r;
      (i.offsetLeft !== f || i.offsetTop !== h || i.offsetWidth !== l || i.offsetHeight !== _ || i.scrollTop !== p || i.scrollLeft !== b) && (this.entries[o].box = r, this.entries[o].isVisible = c, t.push({ target: n, box: r, isVisible: c }));
    }), t.length && this._callback(t), requestAnimationFrame(this._runCallback);
  };
  _getTargetEntry = (t) => {
    const { offsetLeft: s, offsetTop: o, offsetWidth: n, offsetHeight: i } = t, { clientWidth: r, clientHeight: c, scrollLeft: f, scrollTop: h } = this._root, l = o > 1 - i && s > 1 - n && o + i <= c + i - 1 && s + n <= r + n - 1;
    return {
      target: t,
      isVisible: l,
      box: {
        offsetLeft: s,
        offsetTop: o,
        offsetWidth: n,
        offsetHeight: i,
        scrollLeft: f,
        scrollTop: h
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
