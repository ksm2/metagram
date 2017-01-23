import { Element } from '../models/Element';
import { DiagramElement } from './DiagramElement';

export class Document extends Element {
  diagramElements: DiagramElement<any>[] = [];
}
