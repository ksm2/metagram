import fs = require('fs');
import path = require('path');
import { ncp } from 'ncp';

export class FileService {
  readFile(filename: string, encoding: string = 'utf8'): Promise<string> {
    return new Promise<string>((res, rej) => fs.readFile(filename, encoding, (err, data) => err ? rej(err) : res(data)));
  }

  writeFile(data: string, filename: string, encoding: string = 'utf8'): Promise<void> {
    return new Promise<void>((res, rej) => fs.writeFile(filename, data, { encoding }, (err) => err ? rej(err) : res()));
  }

  fileExists(filename: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => fs.exists(filename, (exists) => res(exists)));
  }

  async ensureDirectoryExists(filename: string): Promise<void> {
    const dir = path.dirname(filename);
    return new Promise<void>((res, rej) => fs.stat(dir, (err, stats) => {
      if (err) {
        if (err.errno === -2) {
          return fs.mkdir(dir, (err) => err ? rej(err) : res());
        }

        return rej(err);
      }

      stats.isDirectory() ? res() : rej('Is not a directory');
    }));
  }

  /**
   * Copies a directory recursively from source to destination
   *
   * @param source Source directory
   * @param destination Destination directory
   */
  copyDirectory(source: string, destination: string): Promise<void> {
    return new Promise<void>((res, rej) => ncp(source, destination, err => err ? rej(err) : res()));
  }
}
