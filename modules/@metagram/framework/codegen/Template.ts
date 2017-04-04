import { Element } from '../models/Element';

export class Template {
  /**
   * Renders any kind of data
   *
   * @param data The data to render
   * @param options Some options to pass to the renderer
   * @param next Calls the next data to be rendered
   * @return A promise that resolves after finishing the rendering
   */
  render(data: any, options: any, next: (data: any) => void): string {
    return '';
  }

  /**
   * Generates a filename for given data
   *
   * @param data The data to render
   * @param options Some options to pass to the renderer
   * @return The generated filename
   */
  generateFilename(data: any, options: any = {}): string {
    return '';
  }

  /**
   * Checks if this renderer is supporting given data and options
   *
   * @param data The data to check support for
   * @param [options] Some options to pass to the bundler
   * @return Returns whether this renderer is supporting a given element
   */
  isSupporting(data: any, options: any = {}): boolean {
    return false;
  }
}
