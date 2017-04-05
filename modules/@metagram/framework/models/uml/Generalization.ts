import { Class } from '../../decorators';
import { DirectedRelationship } from './DirectedRelationship';

@Class('http://www.omg.org/spec/UML/20131001:Generalization', DirectedRelationship)
export class Generalization extends DirectedRelationship {
}
