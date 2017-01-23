import { ModelElement } from '../../models/ModelElement';
import { Package } from '../../models/Package';
import { cssClass, forEach } from './helpers';

export default function (model: ModelElement, baseHref: string, ref: (m: ModelElement) => string, body: string) {
  return `
<html lang="en">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <base href="${baseHref}">
  <title>Metagram – ${model.name}</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="container">
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
  </div>
</body>
</html>
  `;
}
