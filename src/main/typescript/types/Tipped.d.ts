// Type Definition for Tipped (https://github.com/staaky/tipped)

declare namespace Tipped {

  type SelectorType = string;
  type ElementType = Element;
  type EventType = string;
  type SelectorOrElement = SelectorType | ElementType;
  type ShowHideEvents = EventType | {
    element?: false | EventType | undefined;
    tooltip?: false | EventType | undefined;
    target?: false | EventType | undefined;
  }
  type Content = string | ElementType;
  type FunctionContent = Content | {
    title?: string | ElementType | undefined;
    content?: string | ElementType | undefined;
  };
  type CreateFunction = (element: ElementType) => FunctionContent;
  type Positions = 'topleft' | 'top' | 'topright' | 'righttop' | 'right' | 'rightbottom' | 'bottomleft' | 'bottom' | 'bottomright' | 'lefttop' | 'left' | 'leftbottom';
  type Sizes = 'x-small' | 'small' | 'medium' | 'large';
  type Skins = 'dark' | 'light' | 'gray' | 'red' | 'green' | 'blue' | 'lightyellow' | 'lightblue' | 'lightpink';

  interface Options {
    ajax?: JQuery.AjaxSettings | undefined;
    behavior?: 'hide' | 'mouse' | 'sticky' | undefined;
    cache?: boolean | undefined;
    container?: SelectorOrElement | undefined;
    containment?: false | SelectorType | undefined | {
      selector?: SelectorType | undefined;
      padding?: number | undefined;
    };
    close?: boolean | 'overlap' | undefined;
    detach?: boolean | undefined;
    fadeIn?: number | undefined;
    fadeOut?: number | undefined;
    fixed?: boolean | undefined;
    hideAfter?: number | undefined;
    hideDelay?: number | undefined;
    hideOn?: false | ShowHideEvents | undefined;
    hideOnClickOutside?: boolean | undefined;
    hideOthers?: boolean | undefined;
    inline?: string | undefined;
    maxWidth?: number | undefined;
    offset?: undefined | {
      x?: number | undefined;
      y?: number | undefined;
    };
    padding?: boolean | undefined;
    position?: Positions | undefined | {
      target?: Positions | undefined;
      tooltip?: Positions | undefined;
    };
    radius?: boolean | undefined;
    shadow?: boolean | undefined;
    showDelay?: number | undefined;
    showOn?: false | ShowHideEvents | undefined;
    size?: Sizes | undefined;
    skin?: Skins | undefined;
    stem?: boolean | undefined;
    spinner?: boolean | undefined;
    target?: 'element' | 'mouse' | ElementType | undefined;
    title?: boolean | string | undefined;
    voila?: boolean | undefined;
    zIndex?: number | undefined;
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
