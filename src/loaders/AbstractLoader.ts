import { Model } from '../model/Model';
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

export abstract class AbstractLoader {
  private cacheDir: string;

  constructor(private fileService: FileService, cacheDir?: string) {
    this.cacheDir = cacheDir || path.join(__dirname, '../../var');
  }

  async loadFromURL(url: string, encoding: string = 'utf8'): Promise<Model> {
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

    return this.loadFromFile(filename, encoding);
  }

  /**
   * Loads a model from file
   *
   * @param filename Name of the file to load
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  async loadFromFile(filename: string, encoding: string = 'utf8'): Promise<Model> {
    const data = await this.fileService.readFile(filename, encoding);
    return this.loadFromString(data);
  }

  /**
   * Loads a model from object
   *
   * @param data An object to load the model element from
   * @returns Promise for a model element
   */
  async loadFromObject(data: ModelDocumentObject): Promise<Model> {
    return new Model(data);
  }

  /**
   * Loads a model from string
   *
   * @param data A string containing data parsable by this loader
   */
  abstract loadFromString(data: string): Promise<Model>;

  /**
   * Loads a model from file
   *
   * @param model Model which should be saved
   * @param filename Name of the file to save
   * @param [encoding] Encoding of that file
   * @returns Promise to successful writing
   */
  async saveToFile(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    const data = await this.saveToString(model);
    this.fileService.writeFile(data, filename, encoding);
  }

  /**
   * Saves a model to object
   *
   * @param model Model which should be saved
   * @returns Promise for an object
   */
  async saveToObject(model: Model): Promise<ModelDocumentObject> {
    return {
      namespaces: model.getNamespaces(),
      content: Array.from(model.getElements()).map(it => it.getData()),
    };
  }

  /**
   * Saves a model to string
   *
   * @param model Model which should be saved
   */
  abstract saveToString(model: Model): Promise<string>;
}
