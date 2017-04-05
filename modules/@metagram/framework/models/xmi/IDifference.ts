import * as Metagram from '../metamodel';
import { IDifference } from './IDifference';

export interface IDifference {
  container: IDifference | undefined;
  difference: IDifference | undefined;
  target: Metagram.Element | undefined;
  getAllDifferences(): Metagram.ArbitraryUniqueCollection<IDifference>;
  getAllTargets(): Metagram.ArbitraryUniqueCollection<Metagram.Element>;
}
