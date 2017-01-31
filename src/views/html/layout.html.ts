import main from './main.html';
import { ModelElement } from '../../models/ModelElement';
import { Package } from '../../models/Package';
import { cssClass, forEach, uriNameFor } from './helpers';

export default function (model: ModelElement, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string, body: string) {
  return main(model.name!, baseHref, roots, model.getRoot().name!, `
    <header>
      <h1 class="name name-${cssClass(model)}">${model.name}</h1>
      <p>
      ${model.getInstanceOf() ? `
        <strong>instance of <a href="${ref(model.getInstanceOf()!)}">${model.getInstanceOf()!.name}</strong></a> from ${uriNameFor(model.getInstanceOf()!)}
      ` : ``}
      </p>
      ${forEach(model.comments, (comment) => `
        <p class="lead">${comment}</p>
      `)}
      <p class="lead">HRef: <a class="model-id" href="overview.html#${model.name}">${model.getHref()}</a></p>
      ${model instanceof Package && model.URI ? `
      <p class="lead">URI: <a href="${model.URI}">${model.URI}</a></p>
      ` : ``}
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="index.html">Home</a>
        </li>
        ${forEach(model.allOwningElements(), (parent) => `
          <li class="breadcrumb-item">
            <a class="name-ref name-${cssClass(parent)}" href="${ref(parent)}">${parent.name}</a>
          </li>
        `)}
        <li class="breadcrumb-item active">
          <span class="name-ref name-${cssClass(model)}">${model.name}</span>
        </li>
      </ol>
    </header>
    <main>
      ${body}
    </main>
  `);
}
