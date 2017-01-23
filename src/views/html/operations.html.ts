import { ModelElement } from '../../models/ModelElement';
import { Property } from '../../models/Property';
import { forEach, cssClass } from './helpers';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';
import { Operation } from '../../models/Operation';
import { ParameterDirectionKind } from '../../models/ParameterDirectionKind';

export default function (operations: Set<Operation>, ref: (m: ModelElement) => string) {
  return operations.size ? `<section>
      <h2>Owned Operations</h2>
      <ul class="list-unstyled">
        ${forEach(operations, (operation) => `
          <li>
            <strong class="name-ref name-${cssClass(operation)}">${operation.name}</strong>
            <strong>(</strong>
            ${forEach([...operation.ownedParameters].filter(p => p.direction !== ParameterDirectionKind.return), (parameter) => `
              <strong>${parameter.name}</strong>
              ${parameter.type ? `&nbsp;<a class="name-ref name-${cssClass(parameter.type)}" href="${ref(parameter.type)}">:${parameter.type.name}</a>` : ``}
              ${parameter.defaultValue instanceof EnumerationLiteral ? ` 
                <a href="${ref(parameter.defaultValue)}">=${parameter.defaultValue.name}</a>
              ` : null !== parameter.defaultValue ? `
                <span>=${parameter.defaultValue}</span>
              ` : ``}
              `, '<strong>,</strong>')}
            <strong>)</strong>
            ${operation.type ? `&nbsp;<a class="name-ref name-${cssClass(operation.type)}" href="${ref(operation.type)}">:${operation.type.name}</a>` : ``}
            ${forEach(operation.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
}