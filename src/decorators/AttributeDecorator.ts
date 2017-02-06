export class AttributeDecorator {
  type: string;
  lower: number;
  upper: number;

  constructor(val: { type: string, lower?: number, upper?: number }) {
    this.type = val.type;
    this.lower = typeof val.lower !== 'undefined' ? val.lower : 1;
    this.upper = typeof val.upper !== 'undefined' ? val.upper : 1;
  }
}
