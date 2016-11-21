export class ModelNamespace {
  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  getURI(): string {
    return this.uri;
  }
}
