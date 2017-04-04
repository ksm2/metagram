import { Attribute as $Attr } from '../Attribute';
import { ArbitraryAmbiguousCollection, ArbitraryUniqueCollection, OrderedAmbiguousCollection, OrderedUniqueCollection } from '../Collections';
import { Element as $Elm } from '../Element';
import { Metamodel as $MM } from '../Metamodel';
import { Documentation } from './Documentation';

/**

 */
export class DocumentationImpl extends $Elm implements Documentation {

  private _contacts: $Attr<string> = new $Attr<string>('contact', false, true, 0, 1);
  private _exporters: $Attr<string> = new $Attr<string>('exporter', false, true, 0, 1);
  private _exporterVersions: $Attr<string> = new $Attr<string>('exporterVersion', false, true, 0, 1);
  private _exporterIDs: $Attr<string> = new $Attr<string>('exporterID', false, true, 0, 1);
  private _longDescriptions: $Attr<string> = new $Attr<string>('longDescription', false, true, 0, Infinity);
  private _shortDescriptions: $Attr<string> = new $Attr<string>('shortDescription', false, true, 0, Infinity);
  private _notices: $Attr<string> = new $Attr<string>('notice', false, true, 0, Infinity);
  private _owners: $Attr<string> = new $Attr<string>('owner', false, true, 0, Infinity);
  private _timestamps: $Attr<Date> = new $Attr<Date>('timestamp', false, true, 0, 1);

  set contact(value: string | undefined) {
    this._contacts.set(value);
  }

  get contact(): string | undefined {
    return this._contacts.get();
  }

  getAllContacts(): ArbitraryUniqueCollection<string> {
    return this._contacts.asSet();
  }

  appendContact(value: string): boolean {
    return this._contacts.append(value);
  }

  removeContact(value: string): boolean {
    return this._contacts.remove(value);
  }

  hasContact(): boolean {
    return this._contacts.isNotEmpty();
  }

  set exporter(value: string | undefined) {
    this._exporters.set(value);
  }

  get exporter(): string | undefined {
    return this._exporters.get();
  }

  getAllExporters(): ArbitraryUniqueCollection<string> {
    return this._exporters.asSet();
  }

  appendExporter(value: string): boolean {
    return this._exporters.append(value);
  }

  removeExporter(value: string): boolean {
    return this._exporters.remove(value);
  }

  hasExporter(): boolean {
    return this._exporters.isNotEmpty();
  }

  set exporterVersion(value: string | undefined) {
    this._exporterVersions.set(value);
  }

  get exporterVersion(): string | undefined {
    return this._exporterVersions.get();
  }

  getAllExporterVersions(): ArbitraryUniqueCollection<string> {
    return this._exporterVersions.asSet();
  }

  appendExporterVersion(value: string): boolean {
    return this._exporterVersions.append(value);
  }

  removeExporterVersion(value: string): boolean {
    return this._exporterVersions.remove(value);
  }

  hasExporterVersion(): boolean {
    return this._exporterVersions.isNotEmpty();
  }

  set exporterID(value: string | undefined) {
    this._exporterIDs.set(value);
  }

  get exporterID(): string | undefined {
    return this._exporterIDs.get();
  }

  getAllExporterIDs(): ArbitraryUniqueCollection<string> {
    return this._exporterIDs.asSet();
  }

  appendExporterID(value: string): boolean {
    return this._exporterIDs.append(value);
  }

  removeExporterID(value: string): boolean {
    return this._exporterIDs.remove(value);
  }

  hasExporterID(): boolean {
    return this._exporterIDs.isNotEmpty();
  }

  set longDescription(value: string | undefined) {
    this._longDescriptions.set(value);
  }

  get longDescription(): string | undefined {
    return this._longDescriptions.get();
  }

  getAllLongDescriptions(): ArbitraryUniqueCollection<string> {
    return this._longDescriptions.asSet();
  }

  appendLongDescription(value: string): boolean {
    return this._longDescriptions.append(value);
  }

  removeLongDescription(value: string): boolean {
    return this._longDescriptions.remove(value);
  }

  hasLongDescription(): boolean {
    return this._longDescriptions.isNotEmpty();
  }

  set shortDescription(value: string | undefined) {
    this._shortDescriptions.set(value);
  }

  get shortDescription(): string | undefined {
    return this._shortDescriptions.get();
  }

  getAllShortDescriptions(): ArbitraryUniqueCollection<string> {
    return this._shortDescriptions.asSet();
  }

  appendShortDescription(value: string): boolean {
    return this._shortDescriptions.append(value);
  }

  removeShortDescription(value: string): boolean {
    return this._shortDescriptions.remove(value);
  }

  hasShortDescription(): boolean {
    return this._shortDescriptions.isNotEmpty();
  }

  set notice(value: string | undefined) {
    this._notices.set(value);
  }

  get notice(): string | undefined {
    return this._notices.get();
  }

  getAllNotices(): ArbitraryUniqueCollection<string> {
    return this._notices.asSet();
  }

  appendNotice(value: string): boolean {
    return this._notices.append(value);
  }

  removeNotice(value: string): boolean {
    return this._notices.remove(value);
  }

  hasNotice(): boolean {
    return this._notices.isNotEmpty();
  }

  set owner(value: string | undefined) {
    this._owners.set(value);
  }

  get owner(): string | undefined {
    return this._owners.get();
  }

  getAllOwners(): ArbitraryUniqueCollection<string> {
    return this._owners.asSet();
  }

  appendOwner(value: string): boolean {
    return this._owners.append(value);
  }

  removeOwner(value: string): boolean {
    return this._owners.remove(value);
  }

  hasOwner(): boolean {
    return this._owners.isNotEmpty();
  }

  set timestamp(value: Date | undefined) {
    this._timestamps.set(value);
  }

  get timestamp(): Date | undefined {
    return this._timestamps.get();
  }

  getAllTimestamps(): ArbitraryUniqueCollection<Date> {
    return this._timestamps.asSet();
  }

  appendTimestamp(value: Date): boolean {
    return this._timestamps.append(value);
  }

  removeTimestamp(value: Date): boolean {
    return this._timestamps.remove(value);
  }

  hasTimestamp(): boolean {
    return this._timestamps.isNotEmpty();
  }

}

$MM.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Documentation', DocumentationImpl);
