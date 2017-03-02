import { Element } from '@metagram/models';
import { DiagramElement } from './DiagramElement';

export class Document extends Element {
  diagramElements: DiagramElement<any>[] = [];
}
