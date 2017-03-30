import chalk = require('chalk');
import { DOMParser } from 'xmldom';
import { KNOWN_MODELS } from '../../models';
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
   * Resolves an XMI tree from a globally known URI
   */
  async resolveKnownURI(uri: string): Promise<ResolvedXMINode> {
    if (!KNOWN_MODELS.has(uri)) throw new Error(`Unknown Model URI: ${uri}`);
    const model = KNOWN_MODELS.get(uri)!;
    return this.resolveURL(model.xmi);
  }

  /**
   * Resolves an XMI tree from a given XMI URL
   */
  async resolveURL(url: string, encoding: string = 'utf8'): Promise<ResolvedXMINode> {
    if (!this.hyperReferences.has(url)) {
      this.hyperReferences.set(url, new Promise(async (resolve) => {
        const xmiString = await this.fetchService.fetch(url, encoding);
        const node = await this.resolveString(url, xmiString);
        resolve(node);
      }));
    }

    return this.hyperReferences.get(url)!;
  }

  /**
   * Resolves an XMI tree from stdin stream
   */
  async resolveStdin(): Promise<ResolvedXMINode> {
    console.info(`Resolving ${chalk.yellow('stdin')} ...`);
    const xmiString = await this.fetchService.getIOService().readStdin();
    return await this.resolveString('stdin', xmiString);
  }

  /**
   * Loads an XMI-tree from an XMI-string
   *
   * @param origin Original URL of the file
   * @param data The data of the XMI document
   * @returns Promise for the XMI-tree's root
   */
  async resolveString(origin: string, data: string): Promise<ResolvedXMINode> {
    const xmlDoc = this.parser.parseFromString(data, 'text/xml');
    const xmiElements = xmlDoc.getElementsByTagNameNS(XMI_URI, 'XMI');
    if (xmiElements.length !== 1) throw new Error(`Unexpected amount of XMI elements: ${xmiElements.length} (expected 1)`);

    // Create a tree of XMI elements
    const element = xmiElements.item(0);
    const tree = new XMITree(origin, element);
    const node = await tree.resolve(this);
    console.info(`Resolved  ${chalk.yellow(origin)}`);

    return node;
  }
}
