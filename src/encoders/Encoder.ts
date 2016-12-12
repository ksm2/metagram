import { FileService } from '../services/FileService';
import path = require('path');
import fetch from 'node-fetch';

export type NamespaceObject = [string, string][];

export interface ModelObject {
  content?: ModelElementObject[];
}

export interface ModelDocumentObject extends ModelObject {
  namespaces: NamespaceObject;
  content: ModelElementObject[];
}

export interface ModelObjectElements {
  [child: string]: ModelElementObject[] | string;
}

export interface ModelElementObject extends ModelObject {
  ns: string;
  type: string;
  id?: string;
  el: ModelObjectElements;
}

export abstract class Encoder {
  private cacheDir: string;

  constructor(private fileService: FileService, cacheDir?: string) {
    this.cacheDir = cacheDir || path.join(__dirname, '../../var');
  }

  /**
   * Loads a model from an URL
   *
   * @param url URL where the file to decode can be found
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  async decodeURL(url: string, encoding: string = 'utf8'): Promise<ModelDocumentObject> {
    console.info(`Resolving ${url}`);
    const filename = path.join(this.cacheDir, url.replace(/[^\w.]/g, '-'));

    const exists = await this.fileService.fileExists(filename);
    if (!exists) {
      console.info(`Downloading ${url}`);
      const res = await fetch(url);
      const text = await res.text();
      console.info(`Caching ${url}`);
      await this.fileService.writeFile(text, filename, encoding);
    } else {
      console.info(`Using cached ${url}`);
    }

    return this.decodeFile(filename, encoding);
  }

  /**
   * Loads a model from file
   *
   * @param filename Name of the file to decode
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  async decodeFile(filename: string, encoding: string = 'utf8'): Promise<ModelDocumentObject> {
    const data = await this.fileService.readFile(filename, encoding);
    return this.decodeString(data);
  }

  /**
   * Loads a model from string
   *
   * @param data A string containing data parsable by this loader
   */
  abstract decodeString(data: string): Promise<ModelDocumentObject>;

  /**
   * Loads a model from file
   *
   * @param model Model document object which should be encoded
   * @param filename Name of the file to save
   * @param [encoding] Encoding of that file
   * @returns Promise to successful writing
   */
  async encodeFile(model: ModelDocumentObject, filename: string, encoding: string = 'utf8'): Promise<void> {
    const data = await this.encodeString(model);
    this.fileService.writeFile(data, filename, encoding);
  }

  /**
   * Saves a model to string
   *
   * @param model Model document object which should be encoded
   */
  abstract encodeString(model: ModelDocumentObject): Promise<string>;
}
