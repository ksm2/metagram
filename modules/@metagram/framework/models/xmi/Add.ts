import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Difference } from './Difference';
import { Element } from '../Element';

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
