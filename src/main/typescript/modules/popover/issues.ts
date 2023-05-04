import { Endpoints } from '@octokit/types';
import { PathInfo } from '../utility/path-info';
import { PopoverCreator, Popover } from './popover';
import * as PopHelper from './pop-helper';


//
// Creator
//

export class IssuesCreator extends PopoverCreator {
  public create(path: string): Popover | undefined {
    const match = path.match(/^\/([^/]+)\/([^/]+)\/issues\/(\d+)$/);
    if(!match) return; // undefined

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new Issues(match[1]!, match[2]!, match[3]!);
  }
}


//
// Types
//

type IssueResponseData = Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}']['response']['data'];


//
// Popover
//

export class Issues extends Popover {
  constructor(
    private readonly owner: string,
    private readonly repo: string,
    issue_number: string,
  ) {
    super(`${PathInfo.apiPath}/repos/${owner}/${repo}/issues/${issue_number}`);
  }

  protected buildContent(responseDate: Date, data: IssueResponseData): PopHelper.Elements {
    const issueContentData: PopHelper.IssueContentData = {
      response_date: responseDate,
      owner: this.owner,
      repo: this.repo,
      octicon: (data.state === 'open') ? 'issue-opened' : 'issue-closed',
      state: data.state,
      html_url: data.html_url,
      title: data.title,
      number: data.number,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user: data.user,
      assignees: data.assignees ?? (data.assignee ? [data.assignee] : []),
      labels: data.labels,
      milestone: data.milestone,
      body: data.body,
    };

    return PopHelper.issueContent(issueContentData);
  }
}
