import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import getStdin = require('get-stdin');
import { ncp } from 'ncp';

export class IOService {
  readFile(filename: string, encoding: string = 'utf8'): Promise<string> {
    return new Promise<string>((res, rej) => fs.readFile(filename, encoding, (err, data) => err ? rej(err) : res(data)));
  }

  writeFile(data: string, filename: string, encoding: string = 'utf8'): Promise<void> {
    return new Promise<void>((res, rej) => fs.writeFile(filename, data, { encoding }, (err) => err ? rej(err) : res()));
  }

  fileExists(filename: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => fs.exists(filename, (exists) => res(exists)));
  }

  async mkDir(directory: string): Promise<void> {
    return new Promise<void>((res, rej) => mkdirp(directory, (err) => err ? rej(err) : res()));
  }

  async ensureDirectoryExists(filename: string): Promise<void> {
    const dir = path.dirname(filename);
    await this.mkDir(dir);
  }

  /**
   * Copies a directory recursively from source to destination
   *
   * @param source Source directory
   * @param destination Destination directory
   */
  copyDirectory(source: string, destination: string): Promise<void> {
    return new Promise<void>((res, rej) => ncp(source, destination, (err) => err ? rej(err) : res()));
  }

  /**
   * Returns the contents of std-in
   */
  async readStdin(): Promise<string> {
    // Get input file
    const input = await getStdin();
    if (!input) throw new Error('Please specify an input file');

    return input;
  }
}
