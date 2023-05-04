import {
  tooltipCheckedClass,
  notTooltipCheckedSelector,
  attachedClass,
  attachedSelectors,
} from './globals';


interface Option {
  root?: Document | Element | undefined;
  container?: string | false | Element | undefined;
}


function attach(
  targetSelector: string,
  higherLevelSelectors: string[], // Higher-level tooltip selectors to avoid tooltip collisions
  contentAttribute: string,
  options?: Option
): void {
  const root = options?.root ?? document;
  const container = options?.container ?? document.body;

  higherLevelSelectors = higherLevelSelectors.concat(attachedSelectors);
  const notHigherSelector = higherLevelSelectors.map(selector => `:not(${selector})`).join('');
  const selector = targetSelector + notHigherSelector + notTooltipCheckedSelector;
  const elems = root.querySelectorAll(selector);

  for(const elem of elems) {
    elem.classList.add(tooltipCheckedClass);

    // Ensure that the child elements do not contain tooltips
    const childSelector = higherLevelSelectors.join(',');
    const child = elem.querySelector(childSelector);
    if(child) continue;

    // Ensure that the parent elements do not contain tooltips
    const parentSelector = targetSelector + ',' + childSelector;
    const parent = elem.parentElement?.closest(parentSelector);
    if(parent) continue;

    const content = elem.getAttribute(contentAttribute);
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


export function attachTooltips(options?: Option): void {
  attach('[title]', [], 'title', options);
  attach('[aria-label]:not(textarea)', ['[title]'], 'aria-label', options);
}
