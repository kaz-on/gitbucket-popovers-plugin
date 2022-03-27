//
// Global Variables
//


export const popoversMode: 'interactive' | 'hide' | 'debug' = 'interactive';
export const timeLocale = undefined;

export const attachedClass = 'popovers-attached';
//export const attachedSelectors = [`.${attachedClass}`, '[data-original-title]', '[data-toggle]'] as const;
export const attachedSelectors = [`.${attachedClass}`, '[data-original-title]', '[data-toggle]:not([data-toggle="tooltip"]'] as const;
export const notAttachedSelector = attachedSelectors.map(selector => `:not(${selector})`).join('');

export const popoverCheckedClass = 'popovers-checked-p';
export const notPopoverCheckedSelector = `:not(.${popoverCheckedClass})` as const;

export const tooltipCheckedClass = 'popovers-checked-t';
export const notTooltipCheckedSelector = `:not(.${tooltipCheckedClass})` as const;

export const contentWrapperClass = 'popovers-content';
