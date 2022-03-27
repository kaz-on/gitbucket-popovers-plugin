import {
  tooltipCheckedClass,
  notTooltipCheckedSelector,
  attachedClass,
  attachedSelectors,
} from './globals';


interface Option {
  root?: Document | Element;
  container?: string | false | Element;
}


export class Tooltips {
  constructor(
    private readonly targetSelector: string,
    private readonly higherLevelSelectors: string[], // Higher-level tooltip selectors to avoid tooltip collisions
    private readonly contentAttribute = 'title',
  ) {
    this.higherLevelSelectors = this.higherLevelSelectors.concat(attachedSelectors);
  }

  public attach(options?: Option): void {
    const root = options?.root ?? document;
    const container = options?.container ?? document.body;

    const notHigherSelector = this.higherLevelSelectors.map(selector => `:not(${selector})`).join('');
    const selector = this.targetSelector + notHigherSelector + notTooltipCheckedSelector;
    const elems = root.querySelectorAll(selector);

    for(const elem of elems) {
      elem.classList.add(tooltipCheckedClass);

      // Ensure that the child elements do not contain tooltips
      const childSelector = this.higherLevelSelectors.join(',');
      const child = elem.querySelector(childSelector);
      if(child) continue;

      // Ensure that the parent elements do not contain tooltips
      const parentSelector = this.targetSelector + ',' + childSelector;
      const parent = elem.parentElement?.closest(parentSelector);
      if(parent) continue;

      const content = elem.getAttribute(this.contentAttribute);
      if(!content) continue;

      elem.setAttribute('title', content);

      // Enable bootstrap tooltip for the element
      $(elem).tooltip({
        container: container,
        placement: 'auto',
      });

      elem.classList.add(attachedClass);
    }
  }
}


export function attachTooltips(options?: Option): void {
  const titleTooltips = new Tooltips('[title]', []);
  titleTooltips.attach(options);

  const ariaLabelTooltips = new Tooltips('[aria-label]:not(textarea)', ['[title]'], 'aria-label');
  ariaLabelTooltips.attach(options);
}
