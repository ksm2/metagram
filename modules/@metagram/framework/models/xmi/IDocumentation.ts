import * as Metagram from '../metamodel';

export interface IDocumentation {
  contact: string | undefined;
  exporter: string | undefined;
  exporterVersion: string | undefined;
  exporterID: string | undefined;
  longDescription: string | undefined;
  shortDescription: string | undefined;
  notice: string | undefined;
  owner: string | undefined;
  timestamp: Date | undefined;
  getAllLongDescriptions(): Metagram.ArbitraryUniqueCollection<string>;
  getAllShortDescriptions(): Metagram.ArbitraryUniqueCollection<string>;
  getAllNotices(): Metagram.ArbitraryUniqueCollection<string>;
  getAllOwners(): Metagram.ArbitraryUniqueCollection<string>;
}
