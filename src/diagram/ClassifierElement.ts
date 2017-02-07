import { Classifier } from '../models/uml/Classifier';
import { Property, VisibilityKind, Operation, Parameter, ParameterDirectionKind } from '../models';
import { Shape } from './Shape';
import { rect, text, measureTextWidth, fillRect } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Cursor } from './Cursor';
import { Color } from './Color';
import { Fill } from './Fill';
import { Class as Clazz } from '../decorators';

const ENTRY_Y_OFFSET = 11;

@Clazz('ClassifierElement', Shape)
export class ClassifierElement extends Shape<Classifier> {
  cursor: Cursor = 'pointer';

  render(canvas: Canvas): void {
    const { ctx } = canvas;

    ctx.save();
    ctx.translate(this.bounds.x, this.bounds.y);

    // Draw background
    const { width, height } = this.bounds;
    const { modelElement, selected, hovered } = this;

    rect(ctx, { width, height }, this.stroke, this.fill);
    ctx.clip();

    // Draw label
    const x = width / 2;
    let offsetY = 16;
    if (modelElement.stereotype) {
      text(ctx, `«${modelElement.stereotype}»`, { x, y: offsetY }, this.font, width, 'center');
      offsetY += 18;
    }
    text(ctx, modelElement.name || '', { x, y: offsetY }, this.font.boldFont, width, 'center');

    offsetY += 16;

    // Draw attributes
    const attributes = modelElement.ownedAttributes;
    if (attributes.size) {
      offsetY = this.renderSeparator(ctx, offsetY);
      offsetY = this.renderProperties([...attributes], ctx, offsetY);
    }

    // Draw operations
    const operations = modelElement.ownedOperations;
    if (operations.size) {
      offsetY = this.renderSeparator(ctx, offsetY);
      offsetY = this.renderOperations([...operations], ctx, offsetY);
    }

    if (selected || hovered) fillRect(ctx, { width, height }, Fill.fromStyle(Color.fromRGBA(0, 0, 0, 0.1)));

    ctx.restore();
  }

  private renderProperties(attributes: Property[], ctx: CanvasRenderingContext2D, offsetY: number): number {
    const offsetX = 10;
    const sepX = 5;
    const visibilityWidth = measureTextWidth(ctx, '~', this.font);
    let y = offsetY;

    for (let i = 0; i < attributes.length; i += 1) {
      const attribute = attributes[i];
      let x = offsetX;
      y += ENTRY_Y_OFFSET;

      // Draw visibility
      if (attribute.visibility) {
        text(ctx, this.getVisibilitySymbol(attribute.visibility), { x: x + visibilityWidth/2, y }, this.font, visibilityWidth, 'center');
      }
      x += visibilityWidth;
      x += sepX;

      // Draw name
      const attributeName = attribute.name || '';
      text(ctx, attributeName, { x, y }, this.font);
      x += measureTextWidth(ctx, attributeName, this.font);

      // Draw type
      if (attribute.type) {
        x += sepX;
        const label = ':' + attribute.type.name;
        text(ctx, label, { x, y }, this.font);
        x += measureTextWidth(ctx, label, this.font);
      }

      // Draw default value
      if (attribute.defaultValue) {
        x += sepX;
        const label = '= ' + attribute.defaultValue;
        text(ctx, label, { x, y }, this.font);
        x += measureTextWidth(ctx, label, this.font);
      }

      y += ENTRY_Y_OFFSET;
    }

    return y;
  }

  private renderOperations(operations: Operation[], ctx: CanvasRenderingContext2D, offsetY: number): number {
    const offsetX = 10;
    const sepX = 5;
    const visibilityWidth = measureTextWidth(ctx, '~', this.font);
    let y = offsetY;

    for (let i = 0; i < operations.length; i += 1) {
      const operation = operations[i];
      let x = offsetX;
      y += ENTRY_Y_OFFSET;

      // Draw visibility
      if (operation.visibility) {
        text(ctx, this.getVisibilitySymbol(operation.visibility), { x: x + visibilityWidth/2, y }, this.font, visibilityWidth, 'center');
      }
      x += visibilityWidth;
      x += sepX;

      // Draw name
      const nameText = operation.name + '(';
      text(ctx, nameText, { x, y }, this.font);
      x += measureTextWidth(ctx, nameText, this.font);

      if (operation.ownedParameters.size) {
        x = this.renderParameters([...operation.ownedParameters], ctx, x, y);
      }

      // Draw closing parenthesis
      text(ctx, ')', { x, y }, this.font);
      x += measureTextWidth(ctx, ')', this.font);

      // Draw return type
      if (operation.type) {
        x += sepX;
        const label = ':' + operation.type.name;
        text(ctx, label, { x, y }, this.font);
        x += measureTextWidth(ctx, label, this.font);
      }

      y += ENTRY_Y_OFFSET;
    }

    return y;
  }

  private renderParameters(parameters: Parameter[], ctx: CanvasRenderingContext2D, offsetX: number, y: number): number {
    let x = offsetX;
    const sepX = 5;

    for (let i = 0; i < parameters.length; i += 1) {
      const parameter = parameters[i];

      // Draw comma
      if (i > 0) {
        text(ctx, ',', { x, y }, this.font);
        x += measureTextWidth(ctx, ',', this.font);
        x += sepX;
      }

      // Draw type
      if (parameter.direction) {
        const label = parameter.direction.toLowerCase();
        text(ctx, label, { x, y }, this.font);
        x += measureTextWidth(ctx, label, this.font);
        x += sepX;
      }

      // Draw name
      text(ctx, parameter.name || '', { x, y }, this.font);
      x += measureTextWidth(ctx, parameter.name || '', this.font);

      // Draw type
      if (parameter.type) {
        x += sepX;
        const label = ':' + parameter.type.name;
        text(ctx, label, { x, y }, this.font);
        x += measureTextWidth(ctx, label, this.font);
      }

      // Draw default value
      if (parameter.defaultValue) {
        x += sepX;
        const label = '= ' + parameter.defaultValue;
        text(ctx, label, { x, y }, this.font);
        x += measureTextWidth(ctx, label, this.font);
      }
    }

    return x;
  }

  private renderSeparator(ctx: CanvasRenderingContext2D, offsetY: number): number {
    let y = offsetY;
    y += .5;
    this.stroke.apply(ctx);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(this.bounds.width, y);
    ctx.stroke();
    y += .5;

    return y;
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
