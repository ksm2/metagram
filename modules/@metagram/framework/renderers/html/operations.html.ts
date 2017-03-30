import { ModelElement, Property, EnumerationLiteral, Operation, ParameterDirectionKind } from '../../models';
import { forEach, cssClass } from './helpers';
import { Renderer } from '../../Renderer';

export default function (operations: Set<Operation>, renderer: Renderer) {
  return operations.size ? `<section>
      <h2>Owned Operations</h2>
      <ul class="list-unstyled">
        ${forEach(operations, (operation) => `
          <li>
            <strong class="name-ref name-${cssClass(operation)}">${operation.name}</strong>
            <strong>(</strong>
            ${forEach([...operation.ownedParameters].filter(p => p.direction !== ParameterDirectionKind.RETURN), (parameter) => `
              <strong>${parameter.name}</strong>
              ${parameter.type ? `&nbsp;<a class="name-ref name-${cssClass(parameter.type)}" href="${renderer.ref(parameter.type)}">:${parameter.type.name}</a>` : ``}
              ${parameter.defaultValue instanceof EnumerationLiteral ? ` 
                <a href="${renderer.ref(parameter.defaultValue)}">=${parameter.defaultValue.name}</a>
              ` : null !== parameter.defaultValue ? `
                <span>=${parameter.defaultValue}</span>
              ` : ``}
              `, '<strong>,</strong>')}
            <strong>)</strong>
            ${operation.type ? `&nbsp;<a class="name-ref name-${cssClass(operation.type)}" href="${renderer.ref(operation.type)}">:${operation.type.name}</a>` : ``}
            ${forEach(operation.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
}
