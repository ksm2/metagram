import { KNOWN_MODELS } from '@metagram/framework';
import { FileService } from '../FileService';
import path = require('path');
import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';
import { XMITree } from './XMITree';
import { ResolvedXMINode } from './ResolvedXMINode';

const XMI_URI = 'http://www.omg.org/spec/XMI/20131001';

export class XMIResolver {
  private parser: DOMParser = new DOMParser();
  private hyperReferences: Map<string, Promise<ResolvedXMINode>> = new Map();

  constructor(private fileService: FileService, private cacheDir: string) {
  }

  /**
   * Resolves an XMI tree from a given XMI URL
   */
  async resolveTree(url: string, encoding: string = 'utf8'): Promise<ResolvedXMINode> {
    let promise = this.hyperReferences.get(url);
    if (!promise) {
      promise = this.loadURLContents(url, encoding);
      this.hyperReferences.set(url, promise);
    }

    return promise;
  }

  /**
   * Resolves an XMI tree from a given URI
   */
  async resolveURI(uri: string): Promise<ResolvedXMINode> {
    if (!KNOWN_MODELS.has(uri)) throw new Error(`Unknown Model URI: ${uri}`);
    const model = KNOWN_MODELS.get(uri)!;
    return this.resolveTree(model.xmi);
  }

  /**
   * Loads string contents of an XMI file from a given URL
   */
  private async loadURLContents(url: string, encoding: string = 'utf8'): Promise<ResolvedXMINode> {
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

    return await this.decodeFile(url, filename, encoding);
  }

  /**
   * Loads a model from file The document's origin
   *
   * @param origin Original URL of the file
   * @param filename Name of the file to decode
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  private async decodeFile(origin: string, filename: string, encoding: string = 'utf8'): Promise<ResolvedXMINode> {
    const data = await this.fileService.readFile(filename, encoding);
    const xmlDoc = this.parser.parseFromString(data, 'text/xml');
    const xmiElements = xmlDoc.getElementsByTagNameNS(XMI_URI, 'XMI');
    if (xmiElements.length !== 1) throw new Error(`Unexpected amount of XMI elements: ${xmiElements.length} (expected 1)`);

    // Create a tree of XMI elements
    const element = xmiElements.item(0);
    const tree = new XMITree(origin, element);
    return await tree.resolve(this);
  }
}
