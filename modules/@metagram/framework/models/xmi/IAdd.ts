import * as Metagram from '../metamodel';
import { IDifference } from './IDifference';

export interface IAdd extends IDifference {
  position: number | undefined;
  addition: Metagram.Element | undefined;
  getAllAdditions(): Metagram.ArbitraryUniqueCollection<Metagram.Element>;
}
