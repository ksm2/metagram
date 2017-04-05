import * as Metagram from '../metamodel';
import { IDifference } from './IDifference';
import { IDocumentation } from './IDocumentation';
import { IExtension } from './IExtension';

export interface IXMI {
  documentation: IDocumentation | undefined;
  difference: IDifference | undefined;
  extension: IExtension | undefined;
  getAllDifferences(): Metagram.ArbitraryUniqueCollection<IDifference>;
  getAllExtensions(): Metagram.ArbitraryUniqueCollection<IExtension>;
}
