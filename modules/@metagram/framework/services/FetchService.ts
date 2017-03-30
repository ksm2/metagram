import path = require('path');
import chalk = require('chalk');
import fetch from 'node-fetch';
import { IOService } from './IOService';

export class FetchService {
  private cacheDir: string | null;

  constructor(private ioService: IOService, cacheDir?: string) {
    this.setCacheDir(cacheDir);
  }

  /**
   * Returns the IO service
   */
  getIOService(): IOService {
    return this.ioService;
  }

  /**
   * Sets the cache directory
   */
  setCacheDir(dir?: string): void {
    this.cacheDir = dir ? path.normalize(dir) : null;
  }

  /**
   * Gets the cache directory
   */
  getCacheDir(): string | null {
    return this.cacheDir;
  }

  /**
   * Fetches contents of an external URL
   *
   * @param url The URL from which contents are loaded
   * @param [encoding] The expected encoding of that content
   * @return The promised contents
   */
  async fetch(url: string, encoding: string = 'utf8'): Promise<string> {
    // Use the cache
    if (this.cacheDir) {
      const filename = path.join(this.cacheDir, url.replace(/[^\w.]/g, '-'));

      const exists = await this.ioService.fileExists(filename);
      if (!exists) {
        console.info(`Resolving ${chalk.yellow(url)} from ${chalk.cyan('download')} ...`);
        const res = await fetch(url);
        const text = await res.text();
        console.info(`Caching ${chalk.yellow(url)}`);
        await this.ioService.writeFile(text, filename, encoding);
        return text;
      }

      console.info(`Resolving ${chalk.yellow(url)} from ${chalk.cyan('cache')} ...`);
      return this.ioService.readFile(filename, encoding);
    }

    console.info(`Resolving ${chalk.yellow(url)} from ${chalk.cyan('download')} ...`);
    const res = await fetch(url);
    return await res.text();
  }
}
