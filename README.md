# PositionObserver
[![Coverage Status](https://coveralls.io/repos/github/thednp/position-observer/badge.svg)](https://coveralls.io/github/thednp/position-observer)
[![ci](https://github.com/thednp/position-observer/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/position-observer/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@thednp/position-observer.svg)](https://www.npmjs.com/package/@thednp/position-observer)
[![typescript version](https://img.shields.io/badge/typescript-5.8.3-brightgreen)](https://www.typescriptlang.org/)
[![vitest version](https://img.shields.io/badge/vitest-3.2.3-brightgreen)](https://vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-6.3.5-brightgreen)](https://vitejs.dev/)


The **PositionObserver** is a lightweight utility that replaces traditional `resize` and `scroll` event listeners. Built on the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver), it provides a way to asynchronously observe changes in the position of a target element with an ancestor element or with a top-level `document`'s viewport.


## Installation

```bash
npm i @thednp/position-observer
```

```bash
yarn add @thednp/position-observer
```

```bash
pnpm add @thednp/position-observer
```

```bash
deno add npm:@thednp/position-observer@latest
```


## Usage

```ts
import PositionObserver from '@thednp/position-observer';

// Find a target element
const myTarget = document.getElementById('myElement');

// Define a callback
const callback = (entries: IntersectionObserverEntry[], currentObserver: PositionObserver) => {
  // Access the observer inside your callback
  // console.log(currentObserver);
  entries.forEach((entry) => {
    if (entry.isIntersecting/* and your own conditions apply */) {
      // Handle position changes
      console.log(entry.boundingClientRect);
    }
  })
};

// Set options
const options = {
  root: document.getElementById('myModal'), // Defaults to document.documentElement
  rootMargin: '0px', // Margin around the root, this applies to IntersectionObserver only
  threshold: 0, // Trigger when any part of the target is visible, this applies to IntersectionObserver only
  callbackMode: 'intersecting', // Options: 'all', 'intersecting', 'update'
};

// Create the observer
const observer = new PositionObserver(callback, options);

// Start observing
observer.observe(myTarget);

// Example callback entries
[{
  target: <div#myElement>,
  boundingClientRect: DOMRectReadOnly,
  intersectionRatio: number,
  isIntersecting: boolean,
  // ... other IntersectionObserverEntry properties
}]

// Get an entry
observer.getEntry(myTarget);

// Stop observing a target
observer.unobserve(myTarget);

// Resume observing
observer.observe(myTarget);

// Stop all observation
observer.disconnect();
```


## Instance Options

| Option | Type | Description |
|--------| -----|-------------|
| `root` | `Element` \| `undefined` | The element used as the viewport for checking target visibility. Defaults to `document.documentElement`.|
| `callbackMode` | "all" \| "intersecting" \| "update" \| `undefined` | Controls `PositionObserver` callback behavior. Defaults to "intersecting". See below for details. |
| `rootMargin` | `string` \| `undefined` | Margin around the root of the `IntersectionObserver`. Uses same format as CSS margins (e.g., "10px 20px"). |
| `threshold` | `number` \| `number[]` \| `undefined` | Percentage of the target's visibility required to trigger the `IntersectionObserver` callback. |

### root
The **PositionObserver** `instance.root` identifies the `Element` whose bounds are treated as the bounding box of the viewport for the element which is the observer's target. Since we're observing for its width and height changes, this root can only be an instance of `Element`, so `Document` cannot be the root of your PositionObserver instance.

The **IntersectionObserver** `instance.root` is always the default, which is `Document`. The two observers really care for different things: one cares about intersection the other cares about position, which is why the two observers cannot use the same root.

When observing targets from a **scrollable** parent element, that parent must be set as root. The same applies to embeddings and `IFrame`s. See the [ScrollSpy](https://github.com/thednp/bootstrap.native/blob/master/src/components/scrollspy.ts) example for implementation details.

### IntersectionObserver
The two initialization options specifically for the IntersectionObserver are `rootMargin` and `threshold` and only apply when using "intersecting" or "update" modes.

### Callback Modes
* `all`: Triggers the callback for all observed targets, regardless of visibility or position changes.
* `intersecting`: Triggers the callback only for targets that are intersecting with the document's viewport and have changed position or root dimensions.
* `update`: Triggers the callback for targets with position/root dimension changes or when a target's intersection status changes (e.g., from intersecting to non-intersecting).


## How it Works
* **Initialization**: Requires a valid callback function, or it throws an Error.
* **Target Validation**: The `observe()` method requires a valid `Element`, or it throws an Error. Targets not attached to the DOM are ignored.
* **Observation**: Tracks changes in the target's top or left position relative to the root, as well as the root's `clientWidth` and `clientHeight`.
* **Callback Trigger**: The callback is invoked based on the `callbackMode`:
  - `all`: Includes every observed target's entry.
  - `intersecting`: Includes only intersecting targets with position or root dimension changes.
  - `update`: Includes targets with position/root dimension changes or a change in intersection status.
* **Intersection Checks**: Uses `IntersectionObserver` with the `document` as the root to determine `isIntersecting`. The `rootMargin` and `threshold` options apply to these checks but have no impact in `all` mode.


## Notes
* **Performance**: Use `entry.boundingClientRect` from `observer.getEntry(target)` to avoid redundant `getBoundingClientRect()` calls.
* **Async Design**: Leverages `requestAnimationFrame` and `IntersectionObserver` for efficient, asynchronous operation. Consider wrapping callbacks in `requestAnimationFrame` for synchronization and to eliminate any potential [observation errors](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors).
* **Visibility**: Targets must be visible (no `display: none` or `visibility: hidden`) for actual accurate bounding box measurements.
* **Cleanup**: Call unobserve() or disconnect() when observation is no longer needed to free resources.
* **ResizeObserver Alternative**: Filter callbacks on `entry.boundingClientRect.width` or height changes to mimic `ResizeObserver`.
* **Scroll Optimization**: For scroll-specific changes, filter callbacks on `entry.boundingClientRect.top` or `left`.
* **IntersectionObserver Root**: The underlying `IntersectionObserver` uses the `document` as its root, while `the PositionObserver`'s root option defines the reference `Element` for position tracking.
* **IntersectionObserverEntry Spread**: This is an interface instance and cannot be [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). 
* **Callback Mode Selection**: Choose `callbackMode` based on your use case:
  - Use `intersecting` for most scenarios where only visible elements matter.
  - Use `update` to track intersection state changes.
  - Use `all` for comprehensive monitoring of *all* targets.
* **RootMargin and Threshold**: These options have no impact in `all` mode, as non-intersecting targets are still processed. They are however relevant in `intersecting` or `update` modes for defining visibility conditions.


## Special Thanks
* [Bart Spaans](https://github.com/spaansba) for his awesome contributions.


## License
The **PositionObserver** is released under the [MIT license](https://github.com/thednp/position-observer/blob/master/LICENSE).
