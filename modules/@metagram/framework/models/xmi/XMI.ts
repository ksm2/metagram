import { ArbitraryAmbiguousCollection, ArbitraryUniqueCollection, OrderedAmbiguousCollection, OrderedUniqueCollection } from '../Collections';
import { Difference } from './Difference';
import { Documentation } from './Documentation';
import { Extension } from './Extension';

/**

 */
export interface XMI {

  /**

   */
  documentation: Documentation | undefined;

  /**

   */
  difference: Difference | undefined;

  getAllDifferences(): ArbitraryUniqueCollection<Difference>;

  /**

   */
  extension: Extension | undefined;

  getAllExtensions(): ArbitraryUniqueCollection<Extension>;

}
