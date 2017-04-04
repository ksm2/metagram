import { ArbitraryAmbiguousCollection, ArbitraryUniqueCollection, OrderedAmbiguousCollection, OrderedUniqueCollection } from '../Collections';
import { Element } from '../Element';
import { Difference } from './Difference';

/**

 */
export interface Replace extends Difference {

  /**

   */
  position: number | undefined;

  /**

   */
  replacement: Element | undefined;

  getAllReplacements(): ArbitraryUniqueCollection<Element>;

}
