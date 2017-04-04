import { ArbitraryAmbiguousCollection, ArbitraryUniqueCollection, OrderedAmbiguousCollection, OrderedUniqueCollection } from '../Collections';

/**

 */
export interface Documentation {

  /**

   */
  contact: string | undefined;

  /**

   */
  exporter: string | undefined;

  /**

   */
  exporterVersion: string | undefined;

  /**

   */
  exporterID: string | undefined;

  /**

   */
  longDescription: string | undefined;

  getAllLongDescriptions(): ArbitraryUniqueCollection<string>;

  /**

   */
  shortDescription: string | undefined;

  getAllShortDescriptions(): ArbitraryUniqueCollection<string>;

  /**

   */
  notice: string | undefined;

  getAllNotices(): ArbitraryUniqueCollection<string>;

  /**

   */
  owner: string | undefined;

  getAllOwners(): ArbitraryUniqueCollection<string>;

  /**

   */
  timestamp: Date | undefined;

}
