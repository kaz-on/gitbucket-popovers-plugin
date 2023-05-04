import { Endpoints } from '@octokit/types';
import { PathInfo } from '../utility/path-info';
import { PopoverCreator, Popover } from './popover';
import * as PopHelper from './pop-helper';


//
// Creator
//

export class PullsCreator extends PopoverCreator {
  public create(path: string): Pulls | undefined {
    const match = path.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)$/);
    if(!match) return; // undefined

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new Pulls(match[1]!, match[2]!, match[3]!);
  }
}


//
// Types
//

type PullResponseData = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response']['data'];


//
// Popover
//

export class Pulls extends Popover {
  constructor(
    private readonly owner: string,
    private readonly repo: string,
    pull_number: string,
  ) {
    super(`${PathInfo.apiPath}/repos/${owner}/${repo}/pulls/${pull_number}`);
  }

  protected buildContent(responseDate: Date, data: PullResponseData): PopHelper.Elements {
    const issueContentData: PopHelper.IssueContentData = {
      response_date: responseDate,
      owner: this.owner,
      repo: this.repo,
      octicon: data.merged ? 'git-merge' : 'git-pull-request',
      state: data.merged ? 'merged' : data.state,
      type: 'pull request',
      html_url: data.html_url,
      title: data.title,
      number: data.number,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user: data.user,
      assignees: data.assignees ?? (data.assignee ? [data.assignee] : []),
      labels: data.labels,
      milestone: data.milestone,
      base_label: data.base.label,
      head_label: data.head.label,
      body: data.body,
    };

    return PopHelper.issueContent(issueContentData);
  }
}
