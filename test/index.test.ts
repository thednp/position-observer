import { beforeEach, describe, expect, it, vi } from "vitest";
import { page } from '@vitest/browser/context';
import getMarkup from "./getMarkup";

import "./assets/bootstrap.min.css";
import PositionObserver from "../src/index";

import styleTip from "./styleTip";

describe("Offcanvas Class Tests", () => {
  const wrapper = document.createElement("div");
  document.body.append(wrapper);

  beforeEach(async () => {
    wrapper.innerHTML = "";
  });

  it("Init without any parameters - throws error", async () => {
    const args = [];
    try {
      // @ts-expect-error
      new PositionObserver(...args);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error).to.have.property(
        "message",
        `PositionObserver Error: undefined is not a function.`,
      );
    }
  });

  it("Init without any target - throws error", async () => {
    try {
      const observer = new PositionObserver(() => {});
      // @ts-expect-error
      await observer.observe();
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
      expect(error).to.have.property(
        "message",
        `PositionObserver Error: undefined is not an instance of HTMLElement.`,
      );
    }
  });

  it("Init with target element", async () => {
    await page.viewport(400, 400);
    const markup = getMarkup();
    wrapper.append(markup);
    await vi.waitFor(() => markup.querySelector('[data-test="tooltip"]'), 200);

    const element = markup.querySelector<HTMLElement>(
      '[data-test="tooltip"]',
    )!;
    const tooltip = markup.querySelector<HTMLElement>('.tooltip')!;
    const arrow = tooltip.querySelector<HTMLElement>('.tooltip-arrow')!;
    const container = markup.ownerDocument.documentElement!;
    const doc = container.ownerDocument!;
    const win = doc.defaultView!;
    const dummyTarget = doc.createElement('span');
    
    let isOpen = false;
    
    const observer = new PositionObserver(([entry]) => {
      update();
      // console.log(observer)
    }, { root: container });

    const update = () => styleTip({ element, container, tooltip, arrow, _observer: observer });

    element.addEventListener('click', async (e) => {
      if (isOpen) {
        tooltip.classList.remove('show');
        tooltip.classList.add('d-none');
        observer.unobserve(element);
      } else {
        tooltip.classList.remove('d-none');
        update();
        tooltip.classList.add('show');
        observer.observe(element);
        // should not be possible to have duplicate entries
        observer.observe(element);
        // should not be possible to observe innexisting targets
        observer.observe(dummyTarget);
      }
      isOpen = !isOpen;
    });

    element.click();
    await new Promise(res => setTimeout(res, 50));
    // console.log(observer.entries)

    await vi.waitFor(() => {
        expect(observer.entries.size).to.equal(1);
        expect(tooltip.className).to.contain('show');
        expect(tooltip.className).to.contain('bs-tooltip-top');
    }, 50);

    win.scrollTo({ top: 500, behavior: 'instant' });
    await vi.waitFor(() => {
        expect(tooltip.className).to.contain('show');
        expect(tooltip.className).to.contain('bs-tooltip-bottom');
    }, 150);

    await new Promise(res => setTimeout(res, 250));
    element.click();
    await vi.waitFor(() => {
        expect(tooltip.className).to.not.contain('show');
        expect(observer.entries.size).to.equal(0);
    }, 50);

    win.scrollTo({ top: 0, behavior: 'instant' });
    observer.disconnect();
    await vi.waitFor(() => {
        expect(observer.entries.size).to.equal(0);
    }, 150);
  });
});
