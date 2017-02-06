import { AttributeDecorator } from './AttributeDecorator';
import { ClassDecorator } from './ClassDecorator';
import { DecoratorReader } from './DecoratorReader';
import { EnumerationDecorator } from './EnumerationDecorator';
import { NamespaceDecorator } from './NamespaceDecorator';

const decoratorReader = new DecoratorReader();

export const Class = decoratorReader.create(ClassDecorator);
export { ClassDecorator };

export const Enumeration = decoratorReader.create(EnumerationDecorator);
export { EnumerationDecorator };

export const Attribute = decoratorReader.create(AttributeDecorator);
export { AttributeDecorator };

export const Namespace = decoratorReader.create(NamespaceDecorator);
export { NamespaceDecorator };

export default decoratorReader;
