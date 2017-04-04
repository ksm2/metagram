import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Element } from '../Element';

/**

 */
export interface Difference {

  /**
  
   */
  container: Difference | undefined;


  /**
  
   */
  difference: Difference | undefined;

  getAllDifferences(): ArbitraryUniqueCollection<Difference>;


  /**
  
   */
  target: Element | undefined;

  getAllTargets(): ArbitraryUniqueCollection<Element>;


}
