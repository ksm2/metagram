import main from './main.html';
import { ModelElement, Package } from '../../models';
import { cssClass, forEach, uriNameFor } from './helpers';
import { Renderer } from '../../Renderer';

export default function (model: ModelElement, baseHref: string, renderer: Renderer, body: string) {
  return main(model.name!, baseHref, renderer.roots, model.getRoot().name!, `
    <header>
      <h1 class="name name-${cssClass(model)}">${model.name}</h1>
      <p>
      ${renderer.instanceOf.has(model) ? `
        <strong>instance of <a href="${renderer.ref(renderer.instanceOf.get(model)!)}">${renderer.instanceOf.get(model)!.name}</strong></a> from ${uriNameFor(renderer.instanceOf.get(model)!)}
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
            <a class="name-ref name-${cssClass(parent)}" href="${renderer.ref(parent)}">${parent.name}</a>
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
