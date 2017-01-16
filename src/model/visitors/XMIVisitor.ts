import { Visitor } from './Visitor';
import { XMI } from '../models/XMI';

export class XMIVisitor extends Visitor<XMI> {
  createInstance(): XMI {
    return new XMI();
  }
}
