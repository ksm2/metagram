import 'whatwg-fetch';

export class FetchService {

  constructor() {
  }

  /**
   * Fetches contents of an external URL
   *
   * @param url The URL from which contents are loaded
   * @param [encoding] The expected encoding of that content
   * @return The promised contents
   */
  async fetch(url: string, encoding: string = 'utf8'): Promise<string> {
    const res = await window.fetch(url);
    return await res.text();
  }
}
