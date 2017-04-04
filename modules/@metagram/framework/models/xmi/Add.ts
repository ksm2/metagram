import { ArbitraryAmbiguousCollection, ArbitraryUniqueCollection, OrderedAmbiguousCollection, OrderedUniqueCollection } from '../Collections';
import { Element } from '../Element';
import { Difference } from './Difference';

/**

 */
export interface Add extends Difference {

  /**

   */
  position: number | undefined;

  /**

   */
  addition: Element | undefined;

  getAllAdditions(): ArbitraryUniqueCollection<Element>;

}
