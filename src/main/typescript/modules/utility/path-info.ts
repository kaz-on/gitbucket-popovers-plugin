import { getPageUrl, getPathName, removeSuffix } from './helpers';


class _PathInfo {
  public readonly baseUrl: string;
  public readonly apiPath: string;

  constructor() {
    this.baseUrl = removeSuffix(getPageUrl(_popoversBasePath), '/');
    this.apiPath = getPathName(_popoversBasePath + '/api/v3');
  }
}


export const PathInfo = new _PathInfo();
