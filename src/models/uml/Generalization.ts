import { DirectedRelationship } from './DirectedRelationship';
import { Class } from '../../decorators/index';

@Class('http://www.omg.org/spec/UML/20131001:Generalization', DirectedRelationship)
export class Generalization extends DirectedRelationship {
}
