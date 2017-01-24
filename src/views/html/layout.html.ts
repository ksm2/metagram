import main from './main.html';
import { ModelElement } from '../../models/ModelElement';
import { Package } from '../../models/Package';
import { cssClass, forEach } from './helpers';

export default function (model: ModelElement, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string, body: string) {
  return main(model.name!, baseHref, roots, model.getRoot().name!, `
    <header>
      <h1 class="name name-${cssClass(model)}">${model.name}</h1>
      <p>
        <strong>${model.getTypeName()}</strong> from ${model.getTypeURI()}
        <a class="model-id" href="ids.html#${model.getID()}">${model.getHref()}</a>
      </p>
      ${forEach(model.comments, (comment) => `
        <p class="lead">${comment}</p>
      `)}
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
