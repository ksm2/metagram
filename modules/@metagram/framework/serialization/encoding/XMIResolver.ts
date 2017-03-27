import { KNOWN_MODELS } from '@metagram/models';
import { DOMParser } from 'xmldom';
import { XMITree } from './XMITree';
import { ResolvedXMINode } from './ResolvedXMINode';
import { FetchService } from '../../services/FetchService';

const XMI_URI = 'http://www.omg.org/spec/XMI/20131001';

export class XMIResolver {
  private parser: DOMParser = new DOMParser();
  private hyperReferences: Map<string, Promise<ResolvedXMINode>> = new Map();

  constructor(private fetchService: FetchService) {
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
    const xmiString = await this.fetchService.fetch(url, encoding);
    return await this.decodeXMIString(url, xmiString);
  }

  /**
   * Loads an XMI-tree from an XMI-string
   *
   * @param origin Original URL of the file
   * @param data The data of the XMI document
   * @returns Promise for the XMI-tree's root
   */
  private async decodeXMIString(origin: string, data: string): Promise<ResolvedXMINode> {
    const xmlDoc = this.parser.parseFromString(data, 'text/xml');
    const xmiElements = xmlDoc.getElementsByTagNameNS(XMI_URI, 'XMI');
    if (xmiElements.length !== 1) throw new Error(`Unexpected amount of XMI elements: ${xmiElements.length} (expected 1)`);

    // Create a tree of XMI elements
    const element = xmiElements.item(0);
    const tree = new XMITree(origin, element);
    return await tree.resolve(this);
  }
}
