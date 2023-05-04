import { Endpoints } from '@octokit/types';
import { PathInfo } from '../utility/path-info';
import { fontColor } from '../utility/helpers';
import { timeLocale } from '../globals';
import { toLocaleDateString, toLocaleDateTimeString, toRelativeDateString, toRelativeTimeString } from '../utility/date-time';


//
// Types
//

export type Elements = string | Node | (string | Node)[];

interface _ElementAttribute {
  alt?: string | null | undefined;
  href?: string | null | undefined;
  src?: string | null | undefined;
  style?: string | null | undefined;
  title?: string | null | undefined;
}

const elementAttributes = ['alt', 'href', 'src', 'style', 'title'] as const;

// Check attribute list
type Attribute1 = typeof elementAttributes[number];
type Attribute2 = keyof _ElementAttribute;
type ElementAttribute = [Attribute1, Attribute2] extends [Attribute2, Attribute1] ? _ElementAttribute : never;

export interface ElementOption extends ElementAttribute {
  class?: string | string[] | null | undefined;
  child?: Elements | null | undefined;
}

type UsersResponseData = Endpoints['GET /users']['response']['data'];
type UserResponseData = UsersResponseData[0];
type IssueLabelsResponseData = Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response']['data']['labels'];
type IssueLabelResponseData = IssueLabelsResponseData[0];
type MilestoneResponseData = Endpoints['GET /repos/{owner}/{repo}/milestones/{milestone_number}']['response']['data'];

export interface IssueContentData {
  response_date: Date;
  owner: string;
  repo: string;
  octicon: Octicon;
  state: string;
  type: string;
  html_url: string;
  title: string;
  number: number;
  created_at: string;
  updated_at: string;
  user: UserResponseData | null | undefined;
  assignees: UsersResponseData;
  labels: IssueLabelsResponseData;
  milestone: MilestoneResponseData | null | undefined;
  base_label?: string | null | undefined;
  head_label?: string | null | undefined;
  body: string | null | undefined;
}


//
// Functions
//

export function text(textContent: string): Text {
  return document.createTextNode(textContent);
}

export function html(htmlContent: string): DocumentFragment {
  const template = document.createElement('template');
  template.innerHTML = htmlContent;
  return template.content;
}

export function fragment(...contents: (string | Node)[]): DocumentFragment {
  const documentFragment = document.createDocumentFragment();
  documentFragment.append(...contents);
  return documentFragment;
}

export function generate(generator: () => Elements | null | undefined): string | Node {
  const generated = generator();
  if(generated == null)
    return fragment();
  if(Array.isArray(generated))
    return fragment(...generated);
  return generated;
}

export function element<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementOption): HTMLElementTagNameMap[K];
export function element<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, options?: ElementOption): HTMLElementDeprecatedTagNameMap[K];
export function element(tagName: string, options?: ElementOption): HTMLElement {
  const elem = document.createElement(tagName);
  if(options) {
    if(options.class) {
      if(Array.isArray(options.class))
        elem.classList.add(...options.class)
      else
        elem.classList.add(options.class);
    }
    if(options.child) {
      if(Array.isArray(options.child))
        elem.append(...options.child);
      else
        elem.append(options.child);
    }
    for(const attribute of elementAttributes) {
      const value = options[attribute];
      if(value != null)
        elem.setAttribute(attribute, value);
    }
  }
  return elem;
}

export function date(dateString: string, responseDate: Date): HTMLSpanElement {
  const date = new Date(dateString);
  return element('span', {
    class: 'date',
    title: toLocaleDateString(date, timeLocale),
    child: toRelativeDateString(responseDate, date, timeLocale),
  });
}

export function datetime(dateString: string, responseDate: Date): HTMLSpanElement {
  const date = new Date(dateString);
  return element('span', {
    class: 'date',
    title: toLocaleDateTimeString(date, timeLocale),
    child: toRelativeTimeString(responseDate, date, timeLocale),
  });
}

export function octicon(name: Octicon, options?: ElementOption): HTMLElement {
  const octicon = element('i', options);
  octicon.classList.add('octicon', `octicon-${name}`);
  return octicon;
}

export function user(userData: UserResponseData): HTMLAnchorElement {
  return element('a', {
    class: 'user',
    href: userData.html_url,
    child: userData.login,
  });
}

export function avatar(userData: UserResponseData, titilePrefix = ''): HTMLAnchorElement {
  return element('a', {
    class: 'avatar',
    href: userData.html_url,
    title: titilePrefix + userData.login,
    child: element('img', {
      class: 'avatar-mini',
      src: userData.avatar_url,
      alt: userData.login,
    }),
  });
}

export function avatars(users: UsersResponseData, titilePrefix = ''): DocumentFragment {
  return fragment(
    ...users.map( userData => avatar(userData, titilePrefix) ),
  );
}

export function label(labelData: IssueLabelResponseData): HTMLSpanElement {
  if(typeof labelData === 'string') {
    return element('span', {
      class: 'label',
      child: labelData,
    });
  }
  else {
    return element('span', {
      class: 'label',
      title: labelData.description,
      style: labelData.color ? `background-color:#${labelData.color};color:#${fontColor(labelData.color)};` : null,
      child: labelData.name,
    });
  }
}

export function labels(labels: IssueLabelsResponseData): DocumentFragment {
  return fragment(
    ...labels.map( labelData => label(labelData) ),
  );
}

export function milestone(milestoneData: MilestoneResponseData, responseDate: Date): DocumentFragment {
  return fragment(
    element('a', {
      class: 'strong',
      href: milestoneData.html_url,
      child: [
        octicon('milestone', { class: milestoneData.state }),
        milestoneData.title,
      ],
    }),
    generate(() =>
      milestoneData.due_on
        ? element('span', {
            class: 'muted',
            child: [' due ', date(milestoneData.due_on, responseDate)],
          })
        : null
    ),
  );
}

export function ref(name: string): HTMLSpanElement {
  return element('span', {
    class: 'badge',
    child: name,
  });
}

export function issueContent(data: IssueContentData): DocumentFragment {
  return fragment(
    // repository
    element('div', {
      class: ['repo', 'small', 'muted'],
      child: element('a', {
        href: `${PathInfo.baseUrl}/${data.owner}/${data.repo}`,
        child: [
          octicon('repo'),
          `${data.owner}/${data.repo}`,
        ],
      }),
    }),

    // title & labels
    element('div', {
      class: 'heading',
      child: [
        // title
        element('div', {
          class: 'title',
          child: [
            octicon(data.octicon, { class: data.state, title: data.state + ' ' + data.type }),
            element('a', {
              href: data.html_url,
              child: [
                element('span', { class: 'strong', child: data.title }),
                element('span', { class: 'muted', child: ' #' + data.number }),
              ],
            }),
          ],
        }),

        // labels
        generate(() =>
          data.labels.length > 0
            ? element('div', {
                class: 'labels',
                child: labels(data.labels),
              })
            : null
        ),
      ],
    }),

    // basic information
    element('div', {
      class: ['info', 'small', 'muted'],
      child: [
        // opened & updated
        element('div', {
          class: 'dates',
          child: [
            'opened ',
            datetime(data.created_at, data.response_date),
            generate(() =>
              data.user ? [' by ', user(data.user)] : null
            ),
            ', updated ',
            datetime(data.updated_at, data.response_date),
          ],
        }),

        // assignees
        generate(() =>
          data.assignees.length > 0
            ? element('div', {
                class: 'assignees',
                child: [
                  ' | ',
                  avatars(data.assignees, 'assigned to '),
                ],
              })
            : null
        ),
      ],
    }),
/*
    // milestone
    generate(() =>
      data.milestone
        ? element('div', {
            class: ['milestone', 'small'],
            child: milestone(data.milestone, data.response_date),
          })
        : null
    ),
*/
    // refs
    generate(() =>
      data.base_label && data.head_label
        ? element('div', {
            class: ['refs', 'muted'],
            child: [
              ref(data.base_label),
              ' ← ',
              ref(data.head_label),
            ],
        })
        : null
    ),

    // body
    generate(() =>
      data.body
        ? element('div', {
            class: 'body',
            child: data.body,
          })
        : null
    ),
  );
}
