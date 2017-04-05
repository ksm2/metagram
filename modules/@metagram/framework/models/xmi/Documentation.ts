import * as Metagram from '../metamodel';
import { IDocumentation } from './IDocumentation';

export class Documentation extends Metagram.Element implements IDocumentation {
  private _contacts: Metagram.Attribute<string>;
  private _exporters: Metagram.Attribute<string>;
  private _exporterVersions: Metagram.Attribute<string>;
  private _exporterIDs: Metagram.Attribute<string>;
  private _longDescriptions: Metagram.Attribute<string>;
  private _shortDescriptions: Metagram.Attribute<string>;
  private _notices: Metagram.Attribute<string>;
  private _owners: Metagram.Attribute<string>;
  private _timestamps: Metagram.Attribute<Date>;

  constructor() {
    super();

    this._contacts = new Metagram.Attribute<string>('contact', false, true, 0, 1);
    this._exporters = new Metagram.Attribute<string>('exporter', false, true, 0, 1);
    this._exporterVersions = new Metagram.Attribute<string>('exporterVersion', false, true, 0, 1);
    this._exporterIDs = new Metagram.Attribute<string>('exporterID', false, true, 0, 1);
    this._longDescriptions = new Metagram.Attribute<string>('longDescription', false, true, 0, Infinity);
    this._shortDescriptions = new Metagram.Attribute<string>('shortDescription', false, true, 0, Infinity);
    this._notices = new Metagram.Attribute<string>('notice', false, true, 0, Infinity);
    this._owners = new Metagram.Attribute<string>('owner', false, true, 0, Infinity);
    this._timestamps = new Metagram.Attribute<Date>('timestamp', false, true, 0, 1);
  }

  set contact(value: string | undefined) {
    this._contacts.set(value);
  }

  get contact(): string | undefined {
    return this._contacts.get();
  }

  getAllContacts(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllExporters(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllExporterVersions(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllExporterIDs(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllLongDescriptions(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllShortDescriptions(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllNotices(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllOwners(): Metagram.ArbitraryUniqueCollection<string> {
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

  getAllTimestamps(): Metagram.ArbitraryUniqueCollection<Date> {
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

Metagram.Metamodel.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Documentation', Documentation);
