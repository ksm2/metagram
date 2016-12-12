import { Model } from '../model/Model';
import { FileService } from '../services/FileService';
import path = require('path');
import fetch from 'node-fetch';
import { Encoder, ModelDocumentObject } from './Encoder';

export abstract class AbstractEncoder implements Encoder {
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

  async loadFromFile(filename: string, encoding: string = 'utf8'): Promise<Model> {
    const data = await this.fileService.readFile(filename, encoding);
    return this.loadFromString(data);
  }

  async loadFromObject(data: ModelDocumentObject): Promise<Model> {
    return new Model(data);
  }

  abstract loadFromString(data: string): Promise<Model>;

  async saveToFile(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    const data = await this.saveToString(model);
    this.fileService.writeFile(data, filename, encoding);
  }

  async saveToObject(model: Model): Promise<ModelDocumentObject> {
    return {
      namespaces: model.getNamespaces(),
      content: Array.from(model.getElements()).map(it => it.getData()),
    };
  }

  abstract saveToString(model: Model): Promise<string>;
}
