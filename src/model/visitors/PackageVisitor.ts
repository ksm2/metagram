import { Visitor } from './Visitor';
import { Package } from '../models/Package';
import { XMI } from '../models/XMI';
import { Element as ModelElement } from '../models/Element';

export class PackageVisitor extends Visitor<Package> {
  createInstance(): Package {
    return new Package();
  }

  visitAttr(name: string, value: string, target: Package): void {
    switch (name) {
      case 'URI': {
        target.URI = value;
        return;
      }
    }
  }
}
