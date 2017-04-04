import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Difference } from './Difference';
import { Element } from '../Element';

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
