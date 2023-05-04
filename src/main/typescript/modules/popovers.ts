import { popoverCheckedClass, notPopoverCheckedSelector, notAttachedSelector } from './globals';
import { getPageUrl, checkAndRemovePrefix } from './utility/helpers';
import { PathInfo } from './utility/path-info';
import { PopoverCreator, Popover } from './popover/popover';
import { IssuesCreator } from './popover/issues';
import { PullsCreator } from './popover/pulls';


interface Option {
  root?: Document | Element | undefined;
  container?: Tipped.SelectorOrElement | undefined;
}


const creators: PopoverCreator[] = [
  new IssuesCreator(),
  new PullsCreator()
];


function createPopover(path: string): Popover | undefined {
  for(const creator of creators) {
    const popover = creator.create(path);
    if(popover)
      return popover;
  }
  return; // undefined
}


export function attachPopovers(options?: Option): void {
  const root = options?.root ?? document;

  const selector = 'a[href]:not([href^="#"])' + notAttachedSelector + notPopoverCheckedSelector;
  const elems = root.querySelectorAll<HTMLAnchorElement>(selector);

  for(const elem of elems) {
    elem.classList.add(popoverCheckedClass);

    const tabs = elem.closest('.nav.nav-tabs');
    if(tabs) continue;

    const linkPageUrl = getPageUrl(elem.href);
    const path = checkAndRemovePrefix(linkPageUrl, PathInfo.baseUrl);
    if(!path) continue;

    const popover = createPopover(path);
    if(!popover) continue;

    popover.attach(elem, options?.container);
  }
}
