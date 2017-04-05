import * as Metagram from '../metamodel';
import { IDifference } from './IDifference';

export interface IDifference {
  container: IDifference | undefined;
  difference: IDifference | undefined;
  getAllDifferences(): Metagram.ArbitraryUniqueCollection<IDifference>;
  target: Metagram.Element | undefined;
  getAllTargets(): Metagram.ArbitraryUniqueCollection<Metagram.Element>;
}
