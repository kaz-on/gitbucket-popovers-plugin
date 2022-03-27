import { popoversMode, contentWrapperClass, attachedClass } from '../globals';
import { attachTooltips } from '../tooltips';
import { isUnknownObject } from '../utility/helpers';
import * as PopHelper from './pop-helper';


//
// Creator
//

export abstract class PopoverCreator {
  public abstract create(path: string): Popover | undefined;
}


//
// Popover
//

export abstract class Popover {
  constructor(
    protected readonly ajaxUrl: string,
  ) {}

  protected abstract buildContent(responseDate: Date | null, data: unknown, textStatus: JQuery.Ajax.SuccessTextStatus, jqXHR: JQuery.jqXHR): PopHelper.Elements;

  private readonly successCallback = (data: unknown, textStatus: JQuery.Ajax.SuccessTextStatus, jqXHR: JQuery.jqXHR): Tipped.FunctionContent => {
    if(popoversMode === 'debug')
      console.log(data);

    const responseDateString = jqXHR.getResponseHeader('date');
    const responseDate = responseDateString ? new Date(responseDateString) : null;

    return PopHelper.element('div', {
      class: contentWrapperClass,
      child: this.buildContent(responseDate, data, textStatus, jqXHR),
    });
  }

  private static getResponseMessage(responseJSON: unknown): string | undefined {
    let responseMessage;
    if(isUnknownObject(responseJSON)) {
      const message = responseJSON['message'];
      if(typeof message === 'string') {
        responseMessage = message;
      }
    }
    return responseMessage;
  }

  private readonly errorCallback = (jqXHR: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, errorThrown: string): Tipped.FunctionContent => {
    const responseMessage = Popover.getResponseMessage(jqXHR.responseJSON);
    const errorMessage = responseMessage || errorThrown;

    return PopHelper.element('div', {
      class: contentWrapperClass,
      child: PopHelper.element('div', {
        class: 'text-danger',
        child: [
          PopHelper.element('span', {
            class: ['strong', 'text-capitalize'],
            child: textStatus + (errorMessage ? ': ' : ''),
          }),
          errorMessage,
        ],
      }),
    });
  }

  public attach(elem: Element, container?: Tipped.SelectorOrElement): void {
    Tipped.create(elem, {
      container: container,
      ajax: {
        type: 'GET',
        url: this.ajaxUrl,
        dataType: 'json',
        jsonp: false,
        cache: true, // Use GitBucket's cache control
        success: this.successCallback,
        error: this.errorCallback,
      },
      showOn: {
        element: 'mouseenter',
        tooltip: (popoversMode === 'hide') ? false : 'mouseenter',
      },
      hideOn: (popoversMode === 'debug') ? false : {
        element: 'mouseleave',
        tooltip: (popoversMode === 'hide') ? 'mouseenter' : 'mouseleave',
      },
      hideOnClickOutside: (popoversMode === 'debug'),
      //hideOthers: true,
      showDelay: 200,
      hideDelay: 100, // Grace time to move the mouse cursor into popovers
      fadeIn: 200, // Prevent the spinner from flashing
      fadeOut: 0, // Prevent popovers from flashing
      afterUpdate: (content) => {
        // Add tooltips inside the popover container
        // This solves the z-index problem and ensures that tooltips are hidden with popovers
        attachTooltips({
          root: content,
          container: content,
        });
      },
      cache: false, // Use GitBucket's cache control
      size: 'large',
      skin: 'light',
      //spinner: false,
    });

    elem.classList.add(attachedClass);
  }
}
