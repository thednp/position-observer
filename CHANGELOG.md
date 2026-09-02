# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.1.6] - 2026-09-02

- `src/index.ts` - Symbol documentation for deno


## [1.1.5] - 2026-09-02

- `src/index.ts` - fully typed

## [1.1.4] - 2026-09-02

### Added
- `deno.json` — JSR publishing as `@thednp/position-observer` (`exports: . -> src/index.ts`), `compilerOptions` (`DOM`, `ESNext`, `strict`), `imports` (`@thednp/shorty`, `@vitest/*`, `playwright`, `vitest`), `tasks` (`test`, `test-ui`, `lint`, `check`, `format`, `fix`), `publish.include` (`src`, `package.json`, `README.md`, `AGENTS.md`, `llms.txt`, `LICENSE`) — mirrors `svg-path-commander/deno.json`
- `scripts/update-deno.js` — syncs `version`/`description`/`keywords`/`license` from `package.json` to `deno.json` (ported from `svg-path-commander`)
- `AGENTS.md` and `llms.txt` — agent/LLM guides: stack (`tsdown`, `vitest` + `@vitest/browser-playwright`, `deno fmt/lint`), architecture (`src/index.ts:21` single class, `_r`/`_w`/`_h`/`_t`/`entries`, `observe:77`, `_rc:115`, `_n:179`), conventions and Issue #7 gotchas
- JSR publish pipeline in `.github/workflows/publish.yml` (`deno publish` after `pnpm publish`)
- 
### Fixed
- `src/index.ts` — guard consistency documented: `observe:85` currently `this._r.contains(target)` (`O(n)`) vs `_rc:133` `target.isConnected` (`O(1)`) — hybrid since `193089f`; `8d9a043` had switched both to `isConnected` (perf win, allows non-ancestor `root` for Issue #7). See `AGENTS.md` Gotchas.

### Changed
- `package.json:15` scripts: `lint` → `lint:ts` (`deno lint src`), added `fix:ts` (`deno lint --fix`), `check:ts` (`tsc --noEmit`), `up:deno` (`deno update --latest && deno run -A scripts/update-deno.js`), `prepublishOnly` now `pnpm update --latest && pnpm up:deno && pnpm lint && pnpm format && pnpm build:all`; `types` → `./dist/index.d.ts` (aligned with `tsdown` output, was `.d.mts`), `files` now includes `AGENTS.md`/`llms.txt`
- `.github/workflows/ci.yml` — broadened `paths` (`src/**/*`, `test`, `deno.json`), added `Deno Setup v2.x`, bumped `Node` `22` → `24`, `Build` now `pnpm build` (was `build:all`), coverage upload kept
- `.github/workflows/publish.yml` — renamed to `Publish to npm / jsr`, added `Deno Setup`, `id-token: write` for provenance, builds via `prepublishOnly`, publishes to both npm and JSR
- `src/index.ts:77,105,115,179,203,208` — explicit return types (`: void`, `: Promise<IntersectionObserverEntry>`, `: IntersectionObserverEntry | undefined`) to satisfy `deno lint` `no-slow-types` / `deno publish` / `deno check` when `deno.json` has `name`
- `deno.json` `imports` for `@thednp/shorty` uses `npm:` specifier (JSR package not available)
- Rebuilt `dist/` (`index.js` version `1.1.5`, `index.d.ts`, `index.js.map`)
- `src/index.ts:85,133` — both guards switched to `target.isConnected` (reverted in next commit to `contains` on `observe` only) — `O(1)` flag vs `O(n)` subtree walk on hot loop; allows observing targets not descendant of `root`
- Updated deps / `pnpm-lock.yaml` (tsdown `0.22.14`, vite `8.2.2`, vitest `4.1.11`, playwright `1.62.1`, `@types/node` `26.x`)
- Rebuilt `dist`/`docs`

### Note
- Commit `193089f` immediately reverted `observe:85` to `this._r.contains(target)` while keeping `_rc:133` as `isConnected` — restores documented invariant `root must contain target` but re-introduces perf cost on `observe` and re-blocks Issue #7 canvas-overlay use case

## [1.1.3] - 2026-03-26

### Changed
- Updated deps (`pnpm-lock.yaml`) — tag `1.1.3` (`ea69cd9`)
- No source changes

## [1.1.2] - 2026-03-19

### Changed
- Version bump `1.1.2` (`0aba399`), README touch-up (`768c0c3`)

## [1.1.1] - 2026-03-18

### Changed
- Workflows update (`ff2f2c9`), removed `badges` workflow, cleaned `.npmignore` (`5bbf19e`), `package.json` maintenance (`c7d99d5`)
- Removed `callbackMode` option — observer now always filters by `isIntersecting` + position/size diff (see `5174862`)

## [1.1.0] - 2025-06-10

### Changed
- **Breaking**: `PositionObserver` now fully leverages `IntersectionObserver` — `IntersectionObserverEntry` is the entry type; `callbackMode` removed in follow-up
- **Added** `rootMargin` / `threshold` options (passed to internal `IntersectionObserver`, root always `document` — `src/index.ts:187`) and `callbackMode` (removed in `1.1.1`)
- Updated tests (`test/index.test.ts`) and `README.md` for new entry shape and options

### Fixed
- Attempt fix #4 (`14d8844`), re-start observing after `unobserve` (`d511d6d`)

## [1.0.11] - 2025-06-09

### Fixed
- CodeQL workflow triggers (`60736fa`, `ef8a70d`, `e8708f5`)
- Bump `1.0.10` → `1.0.11` (`6d2ec0c`)

## [1.0.10] - 2025-06-09

### Added
- Test: re-observe after `unobserve`/`disconnect` — `63dccb4` / `0cd1a00` — reset `requestAnimationFrame` tick when idle to allow restart

## [1.0.6] - 2024-12-06

### Changed
- Observer now tracks `root.clientWidth`/`clientHeight` instead of `target` `right`/`bottom` for size-triggered callbacks (`690a852`)
- Updated deps, `README`, `.npmignore`

## [1.0.2] - 2024-11-22

### Fixed
- Fix #1 (`afcfca8`)

## [1.0.0] - 2024-10-31

### Added
- Stable `1.0.0` (`f594fdb`, `fca7d1a`): `IntersectionObserver` one-shot per target + `requestAnimationFrame` loop (`_rc`), `Map<Element, IntersectionObserverEntry>` (`entries`), `observe`/`unobserve`/`getEntry`/`disconnect`, `root` defaults to `document.documentElement`, `version` static
- Demo with benchmark (`demo/script.js`, `docs/`), `vitest` + `@vitest/browser-playwright` (Chromium) + `istanbul` coverage, `tsdown` build to `dist/` (`ESM` + `.d.ts`)

### Changed
- Renamed `boundingBox` → `boundingClientRect`, `entries` now public `Map` (was static), perf improvements

## [0.0.2] - 2024-10-27

### Added
- `root` constructor option (`7b98598`), initial `IntersectionObserver` + rAF prototype, `getBoundingClientRect` tracking

## [0.0.1] - 2024-10-27

- Initial commit (`36d6e70`, `f82db1e`)
