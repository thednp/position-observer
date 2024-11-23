// @ts-nocheck
// 0.2616 0.23 0.26 0.19 0.2236 0.198 0.2268 0.2174 | 0.1478 | 0.0122 0.01199 0.008 0.0070 0.0067 | 0.0038
// import PositionObserver from '../dist/index';
import PositionObserver from '../src/index';
import styleTip from '../test/styleTip';
import copyToClipboard from './copyToClipboard';
window.PositionObserver = PositionObserver;
// window.copyToClipboard = copyToClipboard;

const element1 = document.querySelector('[data-test="tooltip1"]');
const element2 = document.querySelector('[data-test="tooltip2"]');
const benchAverage1 = document.querySelector('.bench-average1');
// const benchMin1 = document.querySelector('.bench-min1');
const benchMax1 = document.querySelector('.bench-max1');
const benchAverage2 = document.querySelector('.bench-average2');
// const benchMin2 = document.querySelector('.bench-min2');
const benchMax2 = document.querySelector('.bench-max2');
const tooltip1 = document.querySelector('.tooltip.first');
const arrow1 = tooltip1?.querySelector('.tooltip-arrow');
const tooltip2 = document.querySelector('.tooltip.second');
const arrow2 = tooltip2?.querySelector('.tooltip-arrow');
const container = document.body;
let isOpen = null;
let start = 0;
let end = 0;

const testRuns = [];
const getResults = () => {
  // console.log(testRuns.filter(x => x > 0).length);
  // const filteredResults = testRuns.filter(x => x > 0);
  const len = testRuns.length;
  let total = 0;
  for (let i = 0; i < len; i += 1) {
    total += testRuns[i];
  }
  const average = ((total / len) * 1000).toFixed(2);
  const max = (Math.max(...testRuns) * 1000).toFixed(2);
  return { average, max };
}
const showTip = (tip) => {
  tip.classList.remove('d-none');
  tip.classList.add('show');
}
const hideTip = (tip) => {
  tip.classList.add('d-none');
  tip.classList.remove('show');
}
const toggleEvents = (add) => {
  const action = add ? 'addEventListener' : 'removeEventListener';
  window[action]('scroll', handleUpdate, { passive: true });
  window[action]('resize', handleUpdate, { passive: true });
}
const updateObserver = () =>
  styleTip({ element: element1, container, tooltip: tooltip1, arrow: arrow1, _observer: observer });

const updateEvent = () =>
  styleTip({ element: element2, container, tooltip: tooltip2, arrow: arrow2, _observer: observer });

const handleUpdate = (e) => {
  start = window.performance.now();
  requestAnimationFrame(updateEvent);
  // updateEvent();
  if (testRuns.length < 500) {
    end = window.performance.now();
    testRuns.push(end - start);
  } else {
    // console.log({ ...ob });
    isOpen = null;
    hideTip(tooltip2);
    toggleEvents();

    const { average, max } = getResults();
    benchAverage2.textContent = average + 'µ';
    benchMax2.textContent = max + 'µ';
    testRuns.length = 0;
  }
}

const observer = new PositionObserver((_, ob) => {
  start = window.performance.now();
  requestAnimationFrame(updateObserver);
  // updateObserver();
  if (testRuns.length < 500) {
    end = window.performance.now();
    testRuns.push(end - start);
  } else {
    isOpen = null;
    hideTip(tooltip1);
    ob.disconnect();

    const { average, max } = getResults();
    benchAverage1.textContent = average + 'µ';
    benchMax1.textContent = max + 'µ';
    testRuns.length = 0;
  }
});

element1.addEventListener('click', (e) => {
  if (isOpen === tooltip1) {
    observer.disconnect();
    hideTip(tooltip1)
    testRuns.length = 0;
    isOpen = null;
  } else {
    isOpen = tooltip1;
    showTip(tooltip1);
    updateObserver();
    observer.observe(element1);
  }
});

element2.addEventListener('click', (e) => {
  if (isOpen === tooltip2) {
    toggleEvents();
    hideTip(tooltip2)
    testRuns.length = 0;
    isOpen = null;
  } else {
    isOpen = tooltip2;
    showTip(tooltip2);
    updateEvent();
    toggleEvents(true);
  }
});

// const [footer] = document.getElementsByTagName('footer');
// const footerObserver = new PositionObserver(([entry]) => {
//   footer.classList.toggle('text-white', entry.isVisible);
//   footer.classList.toggle('bg-dark', entry.isVisible);
// });
// footerObserver.observe(footer);

const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
let navOpen = false;
const toggleNav = () => {
  navbarCollapse.classList.toggle('show', !navOpen);
  navOpen = !navOpen;
}
navbarToggler.addEventListener('click', toggleNav);

document.querySelectorAll('.btn.font-monospace').forEach(btn => btn.addEventListener('click', copyToClipboard))