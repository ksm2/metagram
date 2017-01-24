import { DecoratorReader } from './DecoratorReader';
import { ClassDecorator } from './ClassDecorator';
import { AttributeDecorator } from './AttributeDecorator';
import { NamespaceDecorator } from './NamespaceDecorator';

const decoratorReader = new DecoratorReader();

export const Class = decoratorReader.create(ClassDecorator);
export { ClassDecorator };

export const Attribute = decoratorReader.create(AttributeDecorator);
export { AttributeDecorator };

export const Namespace = decoratorReader.create(NamespaceDecorator);
export { NamespaceDecorator };

export default decoratorReader;
