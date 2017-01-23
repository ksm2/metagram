import { DirectedRelationship } from './DirectedRelationship';
import { Class } from '../decorators/index';

@Class('Generalization', DirectedRelationship)
export class Generalization extends DirectedRelationship {
}
