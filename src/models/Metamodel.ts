import { Element } from './Element';

export class Metamodel {
  private static _models: Map<string, Element> = new Map();

  /**
   * Registers a model
   *
   * @param ref The reference to find the model
   * @param model An instance of the model description
   */
  static registerModel(ref: string, model: Element): void {
    Metamodel._models.set(ref, model);
  }

  /**
   * Gets a model by its reference
   *
   * @param ref The model reference
   */
  static getModel(ref: string): Element | null {
    return Metamodel._models.get(ref) || null;
  }

  /**
   * Gets a reference for its model
   *
   * @param element The element to look for
   */
  static getRef(element: Element): string | null {
    for (let [ref, el] of Metamodel._models) {
      if (el == element) return ref;
    }
    return null;
  }

  /**
   * Returns all registered models
   */
  static getModels(): Iterable<Element> {
    return Metamodel._models.values();
  }
}
