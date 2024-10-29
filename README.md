# PositionObserver
[![Coverage Status](https://coveralls.io/repos/github/thednp/position-observer/badge.svg)](https://coveralls.io/github/thednp/position-observer)
[![ci](https://github.com/thednp/position-observer/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/position-observer/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@thednp/position-observer.svg)](https://www.npmjs.com/package/@thednp/position-observer)
[![jsDeliver](https://img.shields.io/jsdelivr/npm/hw/@thednp/position-observer)](https://www.jsdelivr.com/package/npm/@thednp/position-observer)
[![typescript version](https://img.shields.io/badge/typescript-5.6.3-brightgreen)](https://www.typescriptlang.org/)
[![vitest version](https://img.shields.io/badge/vitest-2.1.4-brightgreen)](https://vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-5.4.10-brightgreen)](https://vitejs.dev/)

If you were looking for an observer that could replace all your `resize` and/or `scroll` EventListeners, this should be it! The **PositionObserver** works with `requestAnimationFrame` and `getBoundingClientRect` under the hood and its functionality resembles very much to a combination of the [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) and the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), but with a much more simple design.

What can you use after your element has intersected? How to listen to resize or scroll without attaching event listeners? What's the most efficient solution to observe scroll, size and position all at once? Why doesn't MutationObserver cover this? Here's where the **PositionObserver** can cover some of these cases.


## How it works
* when the observer is initialized without a callback, it will throw an `Error`;
* if you call the `observe()` method without a valid HTMLElement target, it will throw an `Error`;
* if the target isn't attached to the DOM, it will not be added to the observer entries;
* once propertly set up, the **PositionObserver** will observe the changes of either top, left, width or height for a given HTMLElement target as well as the scroll position of a designated parent element;
* only when at least one of these values changes the callback will be invoked.


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

// find a suitable target
const target = document.getElementById('myElement');

// define a callback
const callback = (entries: PositionObserverEntry[]) => {
  // keep an eye on your entries
  console.log(entries);

  // find entry for myTarget
  const entry = entries.find(observerEntry => observerEntry.target = target);
  if (entry.isVisible) {
    // do something about it
  }
};

// set some options
const options = {
  // if not set, it will use the document.documentElement
  root: document.getElementById('myModal-or-something'),
}

// create the observer
const observer = new PositionObserver(callback, options);

// start observing the target element position
observer.observe(target);

// when the position of the element changes from DOM manipulations and/or
// the position change was triggered by either scroll / resize events
// this will be the output of this observer callback example
[{
  // the observed target element
  target: <div#myelement>,
  // the target's bounding box
  boundingBox: DOMRect,
  // this will always be true when at least one pixel of the target is visible in the viewport
  isVisible: true,
}]

// anytime you need the entry, find it!!
observer.getEntry(target);

// stop observing the changes for #myElement at any point
observer.unobserve(target);

// when no targets require any observation
// you can disconect the observer
observer.disconect();
```

## Instance Options

### root: HTMLElement | undefined
Sets the `instance._root` private property which identifies the `Element` whose bounds are treated as the bounding box of the viewport for the element which is the observer's target. If not defined then the `Document.documentElement` will be used.
When observing multiple targets from a **scrollable** parent element, that parent must be set as root. The same applies to embeddings and `IFrame`s See the [ScrollSpy](https://github.com/thednp/bootstrap.native/blob/master/src/components/scrollspy.ts) example for implementation details.


## Notes
* the `entry.isVisible` property is only limited to the position of the target within the specified viewport, it doesn't take into account CSS properties or other specific attributes;
* the `getBoundingClientRect` is considered to be a heavy computation, **so use with caution**; for performance reasons, if your callback is focused on values of the target's bounding client rect, be sure to make use of `entry.boundingBox` values (`observer.getEntry(target)`) instead of invoking `getBoundingClientRect()` again on your target;
* if nothing happens when observing a target, please know that the observer's runtime will only call the callback for elements that are descendents of the given root element; this also means that if a target is removed from the document, the callback will not be invoked;
* also if the target element is hidden with either `display: none` or `visibility: hidden` or attributes with the same effect, the bounding box always has ZERO values and never changes, so make sure to have your target visible before calling `observer.observe(target)`;
* because the functionality is powered by `requestAnimationFrame`, all computation always happens before the next paint, in some cases you might want to consider wrapping your **PositionObserver** callback in a `requestAnimationFrame()` invokation for a consistent syncronicity or to eliminate any [unwanted anomalies](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors);
* while the performance benefits over the use of event listeners is undeniable, it's still **important** to `unobserve` targets or `disconnect` the observer to make room in the main thread;
* if you keep track of the changes to the `entry.isVisible` property you could say you have an equivalent for `IntersectionObserver.isIntersecting`; 
* how about an idea to make your **PositionObserver** instance work like a `ResizeObserver`, well you can simply filter your callback to the `entry.boundingBox.offsetHeight !== lastHeight` || `entry.boundingBox.width !== lastWidth` cases, easy right?
* lastly, the **PositionObserver** will observe changes to all sides of a target, but in some cases you might want to narrow down to the changes triggered by scroll, in which case you can filter your callback to a single side `entry.boundingBox.top !== lastTop`, further increasing performance.


## License
The **PositionObserver** is released under the [MIT license](https://github.com/thednp/position-observer/blob/master/LICENSE).
