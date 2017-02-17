import { Classifier } from '../models/uml/Classifier';
import { Property, VisibilityKind, Operation, Parameter } from '../models';
import { Shape } from './Shape';
import { Canvas } from '../canvas/Canvas';
import { Cursor } from './Cursor';
import { Color } from './Color';
import { Fill } from './Fill';
import { Class as Clazz } from '../decorators';
import { InteractiveCanvas } from '../canvas/InteractiveCanvas';
import defineProperty = Reflect.defineProperty;
import { Stroke } from './Stroke';

const ENTRY_Y_OFFSET = 25 / 2;

@Clazz('ClassifierElement', Shape)
export class ClassifierElement extends Shape<Classifier> {
  cursor: Cursor = 'pointer';
  selectedProperty: Property | null = null;
  caret: boolean = false;

  renderContents(canvas: Canvas): void {
    // Draw background
    const { width, height } = this.bounds;
    const { modelElement, selected, hovered } = this;

    canvas.fillRectangle(this.bounds.dimension, this.fill);
    canvas.strokeRectangle(this.bounds.dimension, this.stroke);

    // Draw label
    const x = width / 2;
    let offsetY = 16;
    if (modelElement.stereotype) {
      canvas.drawText(`«${modelElement.stereotype}»`, x, offsetY, this.font, width, 'center');
      offsetY += 18;
    }
    canvas.drawText(modelElement.name || '', x, offsetY, this.font.boldFont, width, 'center');

    offsetY += 16;

    // Draw attributes
    const attributes = modelElement.ownedAttributes;
    if (attributes.size) {
      offsetY = this.renderSeparator(canvas, offsetY);
      offsetY = this.renderProperties(attributes, canvas, offsetY);
    }

    // Draw operations
    const operations = modelElement.ownedOperations;
    if (operations.size) {
      offsetY = this.renderSeparator(canvas, offsetY);
      offsetY = this.renderOperations(operations, canvas, offsetY);
    }

    // Draw a black overlay if selected or hovered
    if (selected || hovered) canvas.fillRectangle(this.bounds.dimension, Fill.fromStyle(Color.fromRGBA(0, 0, 0, 0.1)));
  }

  deselect() {
    super.deselect();
    this.caret = false;
    this.selectedProperty = null;
  }

  onMouseMove(x: number, y: number, i: InteractiveCanvas) {
    const prop = Math.floor((y - 33) / (ENTRY_Y_OFFSET * 2));

    if (this.selected && this.selectedProperty) return;

    this.selectedProperty = null;
    if (prop >= 0) {
      const property = Array.from(this.modelElement.ownedAttributes)[prop];
      if (property) {
        this.selectedProperty = property;
      }
    }
    i.cursor = this.selectedProperty ? 'text' : this.cursor;
    i.rerender();
  }

  onMouseLeave(i: InteractiveCanvas) {
    if (!this.selected)
      this.selectedProperty = null;
  }

  onKeyPress(key: string, i: InteractiveCanvas) {
    if (!this.selectedProperty) return super.onKeyPress(key, i);

    // A single letter is pressed?
    if (key.length == 1) {
      this.selectedProperty.name += key;
      return;
    }

    // Enter is pressed?
    if (key == 'Enter') {
      const property = this.selectedProperty;
      i.deleteSelection(this);
      property.emit('rename', property);
    }

    // A backspace is pressed?
    if (key == 'Backspace' && this.selectedProperty.name) {
      const name = this.selectedProperty.name;
      this.selectedProperty.name = name.substr(0, name.length - 1);
      return;
    }
  }

  onTick(time: number, i: InteractiveCanvas) {
    this.caret = time % 2 == 1;
  }

  private renderProperties(attributes: Set<Property>, canvas: Canvas, offsetY: number): number {
    let y = offsetY;

    for (let attribute of attributes) {
      y = this.renderProperty(attribute, canvas, y);
    }

    return y;
  }

  private renderProperty(attribute: Property, canvas: Canvas, offsetY: number) {
    const visibilityWidth = canvas.measureTextWidth('~', this.font);
    const sepX = 5;
    let x = 10, y = offsetY;
    y += ENTRY_Y_OFFSET;

    // Draw visibility
    if (attribute.visibility) {
      canvas.drawText(this.getVisibilitySymbol(attribute.visibility), x + visibilityWidth / 2, y, this.font, visibilityWidth, 'center');
    }
    x += visibilityWidth;
    x += sepX;

    // Draw name
    const attributeName = attribute.name || '';
    canvas.drawText(attributeName, x, y, this.font);
    x += canvas.measureTextWidth(attributeName, this.font);

    // Draw caret
    if (this.selectedProperty == attribute && this.caret) {
      canvas.drawSimpleLine(x, y - 10, x, y + 10, new Stroke(this.font.style, 1));
    }

    // Draw type
    if (attribute.type) {
      const label = ': ' + attribute.type.name;
      canvas.drawText(label, x, y, this.font);
      x += canvas.measureTextWidth(label, this.font);
    }

    // Draw default value
    if (attribute.defaultValue) {
      x += sepX;
      const label = '= ' + attribute.defaultValue;
      canvas.drawText(label, x, y, this.font);
      x += canvas.measureTextWidth(label, this.font);
    }

    y += ENTRY_Y_OFFSET;

    if (this.selectedProperty == attribute) {
      canvas.drawSimpleLine(10, y, x, y, new Stroke(this.font.style, 1));
    }

    return y;
  }

  private renderOperations(operations: Set<Operation>, canvas: Canvas, offsetY: number): number {
    const offsetX = 10;
    const sepX = 5;
    const visibilityWidth = canvas.measureTextWidth('~', this.font);
    let y = offsetY;

    for (let operation of operations) {
      let x = offsetX;
      y += ENTRY_Y_OFFSET;

      // Draw visibility
      if (operation.visibility) {
        canvas.drawText(this.getVisibilitySymbol(operation.visibility), x + visibilityWidth/2, y, this.font, visibilityWidth, 'center');
      }
      x += visibilityWidth;
      x += sepX;

      // Draw name
      const nameText = operation.name + '(';
      canvas.drawText(nameText, x, y, this.font);
      x += canvas.measureTextWidth(nameText, this.font);

      if (operation.ownedParameters.size) {
        x = this.renderParameters([...operation.ownedParameters], canvas, x, y);
      }

      // Draw closing parenthesis
      canvas.drawText(')', x, y, this.font);
      x += canvas.measureTextWidth(')', this.font);

      // Draw return type
      if (operation.type) {
        x += sepX;
        const label = ':' + operation.type.name;
        canvas.drawText(label, x, y, this.font);
        x += canvas.measureTextWidth(label, this.font);
      }

      y += ENTRY_Y_OFFSET;
    }

    return y;
  }

  private renderParameters(parameters: Parameter[], canvas: Canvas, offsetX: number, y: number): number {
    let x = offsetX;
    const sepX = 5;

    for (let i = 0; i < parameters.length; i += 1) {
      const parameter = parameters[i];

      // Draw comma
      if (i > 0) {
        canvas.drawText(',', x, y, this.font);
        x += canvas.measureTextWidth(',', this.font);
        x += sepX;
      }

      // Draw type
      if (parameter.direction) {
        const label = parameter.direction.toLowerCase();
        canvas.drawText(label, x, y, this.font);
        x += canvas.measureTextWidth(label, this.font);
        x += sepX;
      }

      // Draw name
      canvas.drawText(parameter.name || '', x, y, this.font);
      x += canvas.measureTextWidth(parameter.name || '', this.font);

      // Draw type
      if (parameter.type) {
        x += sepX;
        const label = ':' + parameter.type.name;
        canvas.drawText(label, x, y, this.font);
        x += canvas.measureTextWidth(label, this.font);
      }

      // Draw default value
      if (parameter.defaultValue) {
        x += sepX;
        const label = '= ' + parameter.defaultValue;
        canvas.drawText(label, x, y, this.font);
        x += canvas.measureTextWidth(label, this.font);
      }
    }

    return x;
  }

  private renderSeparator(canvas: Canvas, offsetY: number): number {
    const y = offsetY + .5;
    canvas.drawSimpleLine(0, y, this.bounds.width, y, this.stroke);

    return offsetY + 1;
  }

  private getVisibilitySymbol(kind: string): string {
    switch (kind) {
      case VisibilityKind.PRIVATE: return '–';
      case VisibilityKind.PACKAGE: return '~';
      case VisibilityKind.PROTECTED: return '#';
      case VisibilityKind.PUBLIC: return '+';
      default: return '';
    }
  }
}
