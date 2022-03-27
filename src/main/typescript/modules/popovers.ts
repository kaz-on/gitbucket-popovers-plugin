import { popoverCheckedClass, notPopoverCheckedSelector, notAttachedSelector } from './globals';
import { getPageUrl, checkAndRemovePrefix } from './utility/helpers';
import { PathInfo } from './utility/path-info';
import { PopoverCreator, Popover } from './popover/popover';
import { IssuesCreator } from './popover/issues';
import { PullsCreator } from './popover/pulls';


interface Option {
  root?: Document | Element;
  container?: Tipped.SelectorOrElement;
}


export class Popovers {
  private readonly creators: PopoverCreator[] = [];

  constructor() {
    this.creators.push(new IssuesCreator());
    this.creators.push(new PullsCreator());
  }

  private getPopover(path: string): Popover | undefined {
    for(const creator of this.creators) {
      const popover = creator.create(path);
      if(popover)
        return popover;
    }
    return; // undefined
  }

  public attach(options?: Option): void {
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

      const popover = this.getPopover(path);
      if(!popover) continue;

      popover.attach(elem, options?.container);
    }
  }
}


export function attachPopovers(options?: Option): void {
  const popovers = new Popovers();
  popovers.attach(options);
}
