export class ClassDecorator {
  name: string;
  generalizations: Function[];

  constructor(name: string, ...generalizations: Function[]) {
    this.name = name;
    this.generalizations = generalizations;
  }
}
