import path = require('path');
import fetch from 'node-fetch';
import { FileService } from './FileService';

export class FetchService {

  constructor(private fileService: FileService, private cacheDir: string) {
  }

  /**
   * Fetches contents of an external URL
   *
   * @param url The URL from which contents are loaded
   * @param [encoding] The expected encoding of that content
   * @return The promised contents
   */
  async fetch(url: string, encoding: string = 'utf8'): Promise<string> {
    const filename = path.join(this.cacheDir, url.replace(/[^\w.]/g, '-'));

    const exists = await this.fileService.fileExists(filename);
    if (!exists) {
      console.info(`Resolving \x1b[38;2;175;109;4m${url}\x1b[0m as \x1b[38;2;175;109;4mdownload\x1b[0m ...`);
      const res = await fetch(url);
      const text = await res.text();
      console.info(`Caching ${url}`);
      await this.fileService.writeFile(text, filename, encoding);
      return text;
    }

    console.info(`Resolving \x1b[38;2;175;109;4m${url}\x1b[0m from \x1b[38;2;175;109;4mcache\x1b[0m ...`);
    return this.fileService.readFile(filename, encoding);
  }
}
