// Type Definition for Tipped (https://github.com/staaky/tipped)

declare namespace Tipped {

  type SelectorType = string;
  type ElementType = Element;
  type EventType = string;
  type SelectorOrElement = SelectorType | ElementType;
  type ShowHideEvents = EventType | {
    element?: false | EventType;
    tooltip?: false | EventType;
    target?: false | EventType;
  }
  type Content = string | ElementType;
  type FunctionContent = Content | {
    title?: string | ElementType;
    content?: string | ElementType;
  };
  type CreateFunction = (element: ElementType) => FunctionContent;
  type Positions = 'topleft' | 'top' | 'topright' | 'righttop' | 'right' | 'rightbottom' | 'bottomleft' | 'bottom' | 'bottomright' | 'lefttop' | 'left' | 'leftbottom';
  type Sizes = 'x-small' | 'small' | 'medium' | 'large';
  type Skins = 'dark' | 'light' | 'gray' | 'red' | 'green' | 'blue' | 'lightyellow' | 'lightblue' | 'lightpink';

  interface Options {
    ajax?: JQuery.AjaxSettings;
    behavior?: 'hide' | 'mouse' | 'sticky';
    cache?: boolean;
    container?: SelectorOrElement;
    containment?: false | SelectorType | {
      selector?: SelectorType;
      padding?: number;
    };
    close?: boolean | 'overlap';
    detach?: boolean;
    fadeIn?: number;
    fadeOut?: number;
    fixed?: boolean;
    hideAfter?: number;
    hideDelay?: number;
    hideOn?: false | ShowHideEvents;
    hideOnClickOutside?: boolean;
    hideOthers?: boolean;
    inline?: string;
    maxWidth?: number;
    offset?: {
      x?: number;
      y?: number;
    };
    padding?: boolean;
    position?: Positions | {
      target?: Positions;
      tooltip?: Positions;
    };
    radius?: boolean;
    shadow?: boolean;
    showDelay?: number;
    showOn?: false | ShowHideEvents;
    size?: Sizes;
    skin?: Skins;
    stem?: boolean;
    spinner?: boolean;
    target?: 'element' | 'mouse' | ElementType;
    title?: boolean | string;
    voila?: boolean;
    zIndex?: number;
    afterHide?(content: ElementType, element: ElementType): void;
    afterUpdate?(content: ElementType, element: ElementType): void;
    onShow?(content: ElementType, element: ElementType): void;
  }

  interface Collection {
    show(): Collection;
    hide(): Collection;
    toggle(): Collection;
    disable(): Collection;
    enable(): Collection;
    refresh(): Collection;
    remove(): Collection;
  }

  interface Api {
    clearAjaxCache(): Api;
    create(target: SelectorOrElement, contentOrOptions?: Content | CreateFunction | Options, options?: Options): Collection;
    delegate(selector: SelectorType, contentOrOptions?: Content | Options, options?: Options): void;
    disable(target: SelectorOrElement): Api;
    enable(target: SelectorOrElement): Api;
    findElement(element: ElementType): ElementType;
    get(target: SelectorOrElement): Collection;
    hide(target: SelectorOrElement): Api;
    hideAll(): Api;
    init(): void;
    refresh(target?: SelectorOrElement): Api;
    remove(target: SelectorOrElement): Api;
    setDefaultSkin(skin: Skins): Api;
    setStartingZIndex(zIndex: number): Api;
    show(target: SelectorOrElement): Api;
    toggle(target: SelectorOrElement): Api;
    undelegate(selector: SelectorType): void;
    visible(target?: SelectorOrElement): number;
  }

}

declare const Tipped: Tipped.Api;
