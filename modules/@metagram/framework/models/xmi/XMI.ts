import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Documentation } from './Documentation';
import { Difference } from './Difference';
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
