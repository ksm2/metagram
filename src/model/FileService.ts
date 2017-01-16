import fs = require('fs');

export class FileService {
  readFile(filename: string, encoding: string = 'uft8'): Promise<string> {
    return new Promise<string>((res, rej) => fs.readFile(filename, encoding, (err, data) => err ? rej(err) : res(data)));
  }

  writeFile(data: string, filename: string, encoding: string = 'uft8'): Promise<void> {
    return new Promise<void>((res, rej) => fs.writeFile(filename, data, { encoding }, (err) => err ? rej(err) : res()));
  }

  fileExists(filename: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => fs.exists(filename, (ex) => res(ex)));
  }
}
