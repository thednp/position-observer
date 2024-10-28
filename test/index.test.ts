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
      observer.observe();
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
    const win = container.ownerDocument.defaultView!;

    let isOpen = false;

    const observer = new PositionObserver(([entry]) => {
      // console.log(entry)
        styleTip({ element, container, tooltip, arrow });
    }, { root: container });

    element.addEventListener('click', (e) => {
        if (isOpen) {
            tooltip.classList.remove('show');
            observer.unobserve(element);
        } else {
            styleTip({ element, container, tooltip, arrow });
            tooltip.classList.add('show');
            observer.observe(element);
        }
        isOpen = !isOpen;
    });

    element.click();
    await new Promise(res => setTimeout(res, 250));

    await vi.waitFor(() => {
        expect(observer.entries.length).to.equal(1);
        expect(tooltip.className).to.contain('show');
        expect(tooltip.className).to.contain('bs-tooltip-top');
    }, 150);

    win.scrollTo({ top: 500, behavior: 'instant' });
    await vi.waitFor(() => {
        expect(tooltip.className).to.contain('show');
        expect(tooltip.className).to.contain('bs-tooltip-bottom');
    }, 150);

    await new Promise(res => setTimeout(res, 250));
    element.click();
    await vi.waitFor(() => {
        expect(tooltip.className).to.not.contain('show');
        expect(observer.entries.length).to.equal(0);
    }, 250);

    win.scrollTo({ top: 0, behavior: 'instant' });
    observer.disconnect();
    await vi.waitFor(() => {
        expect(observer.entries.length).to.equal(0);
    }, 50);
  });
});
