import * as Metagram from '../metamodel';

export interface IDocumentation {
  contact: string | undefined;
  exporter: string | undefined;
  exporterVersion: string | undefined;
  exporterID: string | undefined;
  longDescription: string | undefined;
  getAllLongDescriptions(): Metagram.ArbitraryUniqueCollection<string>;
  shortDescription: string | undefined;
  getAllShortDescriptions(): Metagram.ArbitraryUniqueCollection<string>;
  notice: string | undefined;
  getAllNotices(): Metagram.ArbitraryUniqueCollection<string>;
  owner: string | undefined;
  getAllOwners(): Metagram.ArbitraryUniqueCollection<string>;
  timestamp: Date | undefined;
}
