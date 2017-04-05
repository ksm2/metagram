import * as Metagram from '../metamodel';
import { IDifference } from './IDifference';

export interface IReplace extends IDifference {
  position: number | undefined;
  replacement: Metagram.Element | undefined;
  getAllReplacements(): Metagram.ArbitraryUniqueCollection<Metagram.Element>;
}
