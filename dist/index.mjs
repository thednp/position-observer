var T = Object.defineProperty;
var A = (t, e, n) => e in t ? T(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var a = (t, e, n) => A(t, typeof e != "symbol" ? e + "" : e, n);
const B = "DOMContentLoaded", C = navigator.userAgentData, m = C, { userAgent: $ } = navigator, b = $, w = /iPhone|iPad|iPod|Android/i;
// istanbul ignore else @preserve
m ? m.brands.some((t) => w.test(t.brand)) : w.test(b);
const v = /(iPhone|iPod|iPad)/;
m ? m.brands.some(
  (t) => v.test(t.brand)
) : (
  /* istanbul ignore next @preserve */
  v.test(b)
);
b && b.includes("Firefox");
const { head: g } = document;
["webkitPerspective", "perspective"].some(
  (t) => t in g.style
);
const F = (t, e, n, i) => {
  const o = i || !1;
  t.addEventListener(
    e,
    n,
    o
  );
}, L = (t, e, n, i) => {
  const o = i || !1;
  t.removeEventListener(
    e,
    n,
    o
  );
}, O = (t, e, n, i) => {
  const o = (s) => {
    // istanbul ignore else @preserve
    (s.target === t || s.currentTarget === t) && (n.apply(t, [s]), L(t, e, o, i));
  };
  F(t, e, o, i);
}, V = () => {
};
(() => {
  let t = !1;
  try {
    const e = Object.defineProperty({}, "passive", {
      get: () => (t = !0, t)
    });
    // istanbul ignore next @preserve
    O(document, B, V, e);
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
const E = (t) => t != null && typeof t == "object" || !1, p = (t) => E(t) && typeof t.nodeType == "number" && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].some(
  (e) => t.nodeType === e
) || !1, q = (t) => p(t) && t.nodeType === 1 || !1, D = (t) => E(t) && t.constructor.name === "Window" || !1, H = (t) => p(t) && t.nodeType === 9 || !1, W = (t) => D(t) ? t.document : H(t) ? t : p(t) ? t.ownerDocument : globalThis.document, P = (t, e) => {
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
}, j = (t) => W(t).documentElement, M = (t) => typeof t == "function" || !1, x = "PositionObserver Error";
class S {
  /**
   * The constructor takes a single argument, callback, which is called
   * whenever the position of an observed element changes. The callback function
   * should take an array of `PositionObserverEntry` objects as its only argument.
   *
   * @param callback the callback that applies to all targets of this observer
   */
  constructor(e) {
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
      if (!q(e))
        throw new Error(
          `${x}: ${e} is not an instance of HTMLElement.`
        );
      /* istanbul ignore if @preserve - a guard must be set and the real viewport must be used */
      this._root || (this._root = j(e));
      const { clientWidth: n, clientHeight: i } = this._root, o = P(e), { left: s, top: d, bottom: h, right: r, width: c, height: l } = o, u = d > 1 - l && s > 1 - c && h <= i + l - 1 && r <= n + c - 1;
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
        const { target: d, boundingBox: h } = o, r = P(d), { left: c, top: l, bottom: u, right: f, width: _, height: y } = r;
        if (h.left !== c || h.top !== l || h.right !== f || h.bottom !== u) {
          const k = l > 1 - y && c > 1 - _ && u <= i + y - 1 && f <= n + _ - 1;
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
    if (!M(e))
      throw new Error(`${x}: ${e} is not a function.`);
    this.entries = [], this._callback = e, this._root = document == null ? void 0 : document.documentElement, this._tick = 0;
  }
}
export {
  S as default
};
//# sourceMappingURL=index.mjs.map
