var x = Object.defineProperty;
var A = (t, e, n) => e in t ? x(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var a = (t, e, n) => A(t, typeof e != "symbol" ? e + "" : e, n);
const E = "DOMContentLoaded", B = navigator.userAgentData, b = B, { userAgent: T } = navigator, m = T, k = /iPhone|iPad|iPod|Android/i;
// istanbul ignore else @preserve
b ? b.brands.some((t) => k.test(t.brand)) : k.test(m);
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
const C = (t, e, n, i) => {
  const o = i || !1;
  t.addEventListener(
    e,
    n,
    o
  );
}, $ = (t, e, n, i) => {
  const o = i || !1;
  t.removeEventListener(
    e,
    n,
    o
  );
}, F = (t, e, n, i) => {
  const o = (s) => {
    // istanbul ignore else @preserve
    (s.target === t || s.currentTarget === t) && (n.apply(t, [s]), $(t, e, o, i));
  };
  C(t, e, o, i);
}, L = () => {
};
(() => {
  let t = !1;
  try {
    const e = Object.defineProperty({}, "passive", {
      get: () => (t = !0, t)
    });
    // istanbul ignore next @preserve
    F(document, E, L, e);
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
const O = (t) => t != null && typeof t == "object" || !1, V = (t) => O(t) && typeof t.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (e) => t.nodeType === e
) || !1, H = (t) => V(t) && t.nodeType === 1 || !1, w = (t, e) => {
  const { width: n, height: i, top: o, right: s, bottom: d, left: h } = t.getBoundingClientRect();
  let r = 1, c = 1;
  return {
    width: n / r,
    height: i / c,
    top: o / c,
    right: s / r,
    bottom: d / c,
    left: h / r,
    x: h / r,
    y: o / c
  };
}, j = (t) => typeof t == "function" || !1, P = "PositionObserver Error";
class D {
  /**
   * The constructor takes a single argument, callback, which is called
   * whenever the position of an observed element changes. The callback function
   * should take an array of `PositionObserverEntry` objects as its only argument.
   *
   * @param callback the callback that applies to all targets of this observer
   */
  constructor(e, n) {
    a(this, "entries");
    a(this, "_tick");
    a(this, "_root");
    a(this, "_callback");
    /**
     * Start observing the position of the specified element.
     * If the element is not currently attached to the DOM,
     * it will be attached before observation begins.
     * @param target
     */
    a(this, "observe", (e) => {
      if (!H(e))
        throw new Error(
          `${P}: ${e} is not an instance of HTMLElement.`
        );
      const { clientWidth: n, clientHeight: i } = this._root, o = w(e), { left: s, top: d, bottom: h, right: r, width: c, height: l } = o, u = d > 1 - l && s > 1 - c && h <= i + l - 1 && r <= n + c - 1;
      this.entries.push({ target: e, boundingBox: o, isVisible: u }), this._tick = requestAnimationFrame(this._runCallback);
    });
    /**
     * Stop observing the position of the specified element.
     * @param target
     */
    a(this, "unobserve", (e) => {
      const n = this.entries.findIndex((i) => i.target === e);
      this.entries.splice(n, 1);
    });
    /**
     * Private method responsible for all the heavy duty.
     */
    a(this, "_runCallback", () => {
      /* istanbul ignore if @preserve - a guard must be set */
      if (!this.entries.length) return;
      const e = [], { clientWidth: n, clientHeight: i } = this._root;
      this.entries.forEach((o, s) => {
        const { target: d, boundingBox: h } = o, r = w(d), { left: c, top: l, bottom: u, right: f, width: p, height: _ } = r;
        if (h.left !== c || h.top !== l || h.right !== f || h.bottom !== u) {
          const y = l > 1 - _ && c > 1 - p && u <= i + _ - 1 && f <= n + p - 1;
          this.entries[s].boundingBox = r, this.entries[s].isVisible = y, e.push({ target: d, boundingBox: r, isVisible: y });
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
      throw new Error(`${P}: ${e} is not a function.`);
    this.entries = [], this._callback = e, this._root = (n == null ? void 0 : n.root) || (document == null ? void 0 : document.documentElement), this._tick = 0;
  }
}
export {
  D as default
};
//# sourceMappingURL=index.mjs.map
