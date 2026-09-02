# AGENTS.md

Guide for AI coding agents working in this repository.

## Project

**PositionObserver** (`@thednp/position-observer`) — lightweight TypeScript utility that replaces `scroll`/`resize` listeners. Built on `IntersectionObserver` + `requestAnimationFrame` to asynchronously observe changes in a target element's `top`/`left` position and its root's `clientWidth`/`clientHeight`.

- Repo: `thednp/position-observer`
- Version: `1.1.5` (see `package.json:4`)
- License: MIT
- Homepage: https://thednp.github.io/position-observer/

## Stack

- Language: TypeScript (strict, `ESNext`, `Bundler` resolution) — `tsconfig.json:13`
- Build: `tsdown` (`tsdown.config.ts:1`) — outputs ESM + `.d.ts` to `dist/`
- Runtime deps: `@thednp/shorty` (`isElement`, `isFunction`)
- Lint: `deno lint src` + `tsc --noEmit` — `package.json:28`
- Format: `deno fmt src` — `package.json:29`
- Tests: `vitest` with `@vitest/browser-playwright` (Chromium, headless) — `vitest.config.ts:16`
- Package manager: `pnpm@11.22.0` — `package.json:72`
- Node: `>=16`

## Installation

```sh
npm i @thednp/position-observer
# or pnpm add @thednp/position-observer
# or bun add @thednp/position-observer
# or deno add npm:@thednp/position-observer
# or deno add jsr:@thednp/position-observer
# or npx jsr add @thednp/position-observer
```

Deno (JSR) — import raw TS directly:

```ts
import PositionObserver from "jsr:@thednp/position-observer";
```

## Commands

```bash
pnpm install           # install
pnpm build             # tsdown -> dist/
pnpm build:all         # build lib + docs (vite build demo)
pnpm build:docs        # docs only
pnpm dev               # vite demo at ./demo/index.html :8577
pnpm serve             # vite docs at ./docs/index.html :8577
pnpm test              # pnpm pre-test + vitest --browser.headless
pnpm test-ui           # interactive browser UI
pnpm lint              # deno lint src && pnpm check:ts
pnpm format            # deno fmt src
pnpm check:ts          # tsc --noEmit
```

Never use `npm`/`yarn` in this repo. Always use `pnpm`.

## Directory Structure

```
src/index.ts          # entire library (single class, ~213 lines)
dist/                 # built artifacts (generated)
demo/                 # vite demo app (script.js, index.html)
docs/                 # built docs (GitHub Pages)
test/
  index.test.ts       # browser tests (vitest/browser)
  getMarkup.ts        # test fixture markup
  styleTip.ts         # tooltip positioning helper used in tests
  assets/bootstrap.min.css
experiments/          # excluded from tsconfig, manual perf experiments
vitest.config.ts      # browser + istanbul coverage
tsdown.config.ts      # build config
tsconfig.json         # strict, DOM + ESNext
```

## Architecture

Single class `PositionObserver` in `src/index.ts:21`.

```ts
new PositionObserver(callback, options?)
  callback: (entries: IntersectionObserverEntry[], observer: PositionObserver) => void
  options: { root?: Element, rootMargin?: string, threshold?: number | number[] }
```

Key internals:
- `this._r: Element` — PositionObserver root (defaults to `document.documentElement`) — `src/index.ts:62`. **Not** the `IntersectionObserver` root (which is always `document` — `src/index.ts:187`).
- `this._w/_h: number` — cached `root.clientWidth/clientHeight` — `src/index.ts:66`.
- `this._t: number` — `requestAnimationFrame` tick id.
- `this.entries: Map<Element, IntersectionObserverEntry>` — public.
- `observe(target)` — `src/index.ts:77` validates `isElement`, guards with `this._r.contains(target)` (currently), then calls `this._n(target)` -> stores entry and starts `_rc` if not running.
- `_rc()` — `src/index.ts:115` hot loop: `requestAnimationFrame` -> for each entry checks `target.isConnected` (`src/index.ts:133`), re-creates entry via `_n()`, filters by `isIntersecting` and by `oldBoundingBox.top/left` or `root` size change (`src/index.ts:142`), then invokes callback with `updates`.
- `_n(target)` — `src/index.ts:179` creates a one-shot `IntersectionObserver` (with `rootMargin`/`threshold` from options), observes target, resolves with first entry, disconnects.
- `unobserve`, `getEntry`, `disconnect` — `src/index.ts:105,203,208`.

Flow: `observe()` -> `_n()` (initial rect) -> `_rc()` loop (poll via rAF + fresh IntersectionObserver per frame per target).

> See `README.md:101` for intended semantics. `root` is treated as viewport for size tracking; `IntersectionObserver` always uses `document`.

## Conventions

- ESM only (`"type": "module"` — `package.json:10`). Do not add CJS exports without updating `tsdown.config.ts:10`.
- Keep `src/index.ts` single-file unless refactoring is explicit. Externalize deps via `tsdown.config.ts:18` (`neverBundle`).
- Use `@thednp/shorty` helpers, not manual `typeof` checks.
- Error messages use prefix `PositionObserver Error` — `src/index.ts:15`.
- `/* istanbul ignore ... @preserve */` comments are load-bearing for coverage — preserve them.
- Strict TS: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` — `tsconfig.json:16`.
- Formatting is `deno fmt` (not Prettier). Run before commit if you touch `src/`.
- Do not edit `dist/` or `docs/assets/` manually — they are build outputs.
- Exports in `package.json:11` (`".": "./dist/index.js"`) must stay in sync with `tsdown.config.ts:8`.

## Testing

- Browser tests only — requires Playwright + Chromium.
- Run `pnpm test` (headless) or `pnpm test-ui` (interactive).
- Tests use `vitest/browser` `page.viewport`, `vi.waitFor`, synthetic `scrollTo` — see `test/index.test.ts:46`.
- Coverage via `@vitest/coverage-istanbul`, includes `src/**/*.{ts,tsx}` — `vitest.config.ts:19`.
- Fixture: `test/getMarkup.ts` generates tooltip DOM; `test/styleTip.ts` is the positioning logic under test.
- Add new tests to `test/index.test.ts` following existing `describe("Offcanvas Class Tests")` pattern.

## Gotchas & Active Issues

1. **Root guard inconsistency (perf + behavior)** — `observe():85` uses `this._r.contains(target)` (`O(n)` walk) while `_rc():133` uses `target.isConnected` (`O(1)`). The last two commits flipped this:
   - `8d9a043` (v1.1.4) switched both to `isConnected` (perf win, allowed non-ancestor targets).
   - `193089f` reverted `observe()` to `contains`, keeping `_rc` as `isConnected`. Hybrid is intentional per README ("root must contain target") but breaks Issue #7.
2. **Issue #7** — https://github.com/thednp/position-observer/issues/7 — user wants `root = canvas` overlay that is *not* ancestor of targets, to suppress callbacks when both scroll together. `contains` blocks this outright. Even with `isConnected`, current `_rc` diffs absolute `left/top` (`src/index.ts:139`), so co-scrolled targets still fire. Fixing #7 properly requires diffing *relative* rect (`targetRect - rootRect`) or documenting `contains` as wontfix.
3. **Hot loop cost** — `_rc` creates a new `IntersectionObserver` per target per frame (`src/index.ts:181`). Avoid adding heavy work inside the `entries.forEach` before `resolve(updates)` (`src/index.ts:156` resolves before async `_n` promises settle — `queue` is not truly awaited in order; `updates` is mutated async after `resolve`).
4. **`rootMargin`/`threshold` only affect `isIntersecting` gate** (`src/index.ts:137`), not position diff. Don't expect them to filter position updates.
5. **Visibility** — targets with `display:none`/`visibility:hidden` yield unstable `boundingClientRect` — noted in `README.md:111`.

## Workflow for Agents

1. Read `src/index.ts` fully before editing.
2. Prefer small, surgical edits. Run `pnpm check:ts && pnpm lint` after changes.
3. Verify with `pnpm test` (browser). If Playwright not available, at least run `pnpm check:ts`.
4. Rebuild with `pnpm build` if you need to update `dist/` for manual verification.
5. Do not commit `coverage/`, `.nyc_output/`, or `node_modules/`.
6. When fixing #7, decide explicitly: keep `contains` (document wontfix) or switch to `isConnected` + relative position logic — do not leave hybrid.

## Useful References

- README: `README.md`
- Demo: `demo/script.js`, `demo/index.html`
- Build: `tsdown.config.ts`
- Tests: `test/index.test.ts`
- Config: `tsconfig.json`, `vitest.config.ts`
