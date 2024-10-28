var A = Object.defineProperty;
var E = (t, e, i) => e in t ? A(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var a = (t, e, i) => E(t, typeof e != "symbol" ? e + "" : e, i);
const B = "DOMContentLoaded", T = navigator.userAgentData, b = T, { userAgent: C } = navigator, m = C, y = /iPhone|iPad|iPod|Android/i;
b ? b.brands.some((t) => y.test(t.brand)) : y.test(m);
const v = /(iPhone|iPod|iPad)/;
b ? b.brands.some(
  (t) => v.test(t.brand)
) : (
  /* istanbul ignore next @preserve */
  v.test(m)
);
m && m.includes("Firefox");
const { head: g } = document;
["webkitPerspective", "perspective"].some(
  (t) => t in g.style
);
const $ = (t, e, i, n) => {
  const o = n || !1;
  t.addEventListener(
    e,
    i,
    o
  );
}, F = (t, e, i, n) => {
  const o = n || !1;
  t.removeEventListener(
    e,
    i,
    o
  );
}, L = (t, e, i, n) => {
  const o = (s) => {
    (s.target === t || s.currentTarget === t) && (i.apply(t, [s]), F(t, e, o, n));
  };
  $(t, e, o, n);
}, O = () => {
};
(() => {
  let t = !1;
  try {
    const e = Object.defineProperty({}, "passive", {
      get: () => (t = !0, t)
    });
    L(document, B, O, e);
  } catch {
  }
  return t;
})();
["webkitTransform", "transform"].some(
  (t) => t in g.style
);
["webkitAnimation", "animation"].some(
  (t) => t in g.style
);
["webkitTransition", "transition"].some(
  (t) => t in g.style
);
const V = (t) => t != null && typeof t == "object" || !1, H = (t) => V(t) && typeof t.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (e) => t.nodeType === e
) || !1, w = (t) => H(t) && t.nodeType === 1 || !1, P = (t, e) => {
  const { width: i, height: n, top: o, right: s, bottom: d, left: h } = t.getBoundingClientRect();
  let r = 1, c = 1;
  return {
    width: i / r,
    height: n / c,
    top: o / c,
    right: s / r,
    bottom: d / c,
    left: h / r,
    x: h / r,
    y: o / c
  };
}, j = (t) => typeof t == "function" || !1, x = "PositionObserver Error";
class D {
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
    a(this, "entries");
    a(this, "_tick");
    a(this, "_root");
    a(this, "_callback");
    /**
     * Start observing the position of the specified element.
     * If the element is not currently attached to the DOM,
     * it will NOT be added to the entries.
     * @param target
     */
    a(this, "observe", (e) => {
      if (!w(e))
        throw new Error(
          `${x}: ${e} is not an instance of HTMLElement.`
        );
      if (!this._root.contains(e)) return;
      const { clientWidth: i, clientHeight: n } = this._root, o = P(e), { left: s, top: d, bottom: h, right: r, width: c, height: l } = o, u = d > 1 - l && s > 1 - c && h <= n + l - 1 && r <= i + c - 1;
      this.entries.push({ target: e, boundingBox: o, isVisible: u }), this._tick || (this._tick = requestAnimationFrame(this._runCallback));
    });
    /**
     * Stop observing the position of the specified element.
     * @param target
     */
    a(this, "unobserve", (e) => {
      const i = this.entries.findIndex((n) => n.target === e);
      this.entries.splice(i, 1);
    });
    /**
     * Private method responsible for all the heavy duty.
     */
    a(this, "_runCallback", () => {
      if (!this.entries.length) return;
      const e = [], { clientWidth: i, clientHeight: n } = this._root;
      this.entries.forEach((o, s) => {
        const { target: d, boundingBox: h } = o, r = P(d), { left: c, top: l, bottom: u, right: f, width: p, height: _ } = r;
        if (h.left !== c || h.top !== l || h.right !== f || h.bottom !== u) {
          const k = l > 1 - _ && c > 1 - p && u <= n + _ - 1 && f <= i + p - 1;
          this.entries[s].boundingBox = r, this.entries[s].isVisible = k, e.push({ target: d, boundingBox: r, isVisible: k });
        }
      }), e.length && this._callback(e), requestAnimationFrame(this._runCallback);
    });
    /**
     * Immediately stop observing all elements.
     */
    a(this, "disconnect", () => {
      cancelAnimationFrame(this._tick), this.entries.length = 0, this._tick = 0;
    });
    if (!j(e))
      throw new Error(`${x}: ${e} is not a function.`);
    this.entries = [], this._callback = e, this._root = w(i == null ? void 0 : i.root) ? i.root : document == null ? void 0 : document.documentElement, this._tick = 0;
  }
}
export {
  D as default
};
//# sourceMappingURL=index.mjs.map
