# PositionObserver
[![Coverage Status](https://coveralls.io/repos/github/thednp/position-observer/badge.svg)](https://coveralls.io/github/thednp/position-observer)
[![ci](https://github.com/thednp/position-observer/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/position-observer/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/position-observer.svg)](https://www.npmjs.com/package/position-observer)
[![jsDeliver](https://img.shields.io/jsdelivr/npm/hw/position-observer)](https://www.jsdelivr.com/package/npm/position-observer)
[![typescript version](https://img.shields.io/badge/typescript-5.6.3-brightgreen)](https://www.typescriptlang.org/)
[![vitest version](https://img.shields.io/badge/vitest-2.1.3-brightgreen)](https://vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-5.4.10-brightgreen)](https://vitejs.dev/)

The **PositionObserver** class works with `requestAnimationFrame` under the hood for maximum performance and its functionality resembles very much to the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) or the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). That is why you might have to follow [the official guidance](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors) for troubleshooting.

If you were looking for an observer that could replace all your `resize` and/or `scroll` EventListeners, well then, this should be it!

**How it works**
* if you initialize the class without a callback, it will throw an `Error`;
* if you call the `observe()` method without a valid HTMLElement target, again it will throw an `Error`;
* once propertly set up, the **PositionObserver** will observe the changes of top, left, bottom and right (the extremes) for a given HTMLElement target;
* only when these values change the callback will be invoked.

## Installation

```bash
npm i @thednp/position-observer
# or
yarn add @thednp/position-observer
# or
pnpm install @thednp/position-observer
```

## Usage

```ts
// import the PositionObserver class
import PositionObserver, { type PositionObserverEntry } from '@thednp/position-observer';

// define a callback
const callback = (entries: PositionObserverEntry[]) => {
  console.log(entries);

  // find entry for myTarget
  const entry = entries.find(observerEntry => observerEntry.target = target);
  if (entry.isVisible) {
    // do something about it
  }
};

// set some options
const options = {
  root: document.body, // if not set, this will be the document.documentElement
}

// create an observer
const observer = new PositionObserver(callback, options);

// find a suitable target
const target = document.getElementById('myElement');

// start observing the position
observer.observe(target);

// When the position of the element changes from DOM manipulations and/or
// the position change was triggered by either scroll / resize events
// this will be the output of observer callback
[{
  target: <div#myelement>, // the observed target element
  boundingBox: DOMRect, // the target's bounding box
  isVisible: true, // this will always be true when at least one pixel of the target is visible in the viewport
}]

// at some point you may want to remove #myElement from the observer entries
observer.unobserve(target);

// when no other targets require any observation
// you can disconect the observer
observer.disconect();
```

## Instance Options

### root: HTMLElement | null
Sets the `instance._root` private property which identifies the `Element` whose bounds are treated as the bounding box of the viewport for the element which is the observer's target. If not defined then the `Document.documentElement` will be used. When observing multiple targets from a scrollable parent, that parent must be set as root. See the [ScrollSpy](https://github.com/thednp/bootstrap.native/blob/master/src/components/scrollspy.ts) example for more implementation details.


## Notes
* because the functionality is powered by `requestAnimationFrame`, all computation always happens before the next paint, in some cases you might want to consider wrapping your **PositionObserver** callback in a `requestAnimationFrame()` invokation for a consistent syncronicity or to eliminate any [unwanted anomalies](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors);
* while the performance benefits over the use of event listeners is undeniable, it's still **important** to `unobserve` targets or `disconnect` the observer to make room in the main thread;
* if you keep track of the changes to the `entry.isVisible` property you could say you have an equivalent for `IntersectionObserver.isIntersecting`; 
* how about an idea to make your **PositionObserver** instance work like a `ResizeObserver`, well you can simply filter your callback to the `entry.boundingBox.left !== lastLeft` || `entry.boundingBox.right !== lastRight` cases, easy right?
* lastly, the **PositionObserver** will only observe changes to all sides, but in some cases you might want to only observe changes triggered by scroll, in which case you can filter your callback to a single side `entry.boundingBox.top !== lastScrollTop`, further increasing performance.


## License
The **PositionObserver** is released under the [MIT license](https://github.com/thednp/position-observer/blob/master/LICENSE).
