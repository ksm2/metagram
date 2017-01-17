import { Element } from '../../models/Element';
import { Package } from '../../models/Package';
import { cssClass, forEach, filename } from './helpers';

export default function (model: Element, baseHref: string, body: string) {
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
        <strong>${model.constructor.name}</strong>
        <a class="model-id" href="ids.html#${model.ID}">${model.getHref()}</a>
      </p>
      <p class="lead">${model.comment}</p>
      ${model instanceof Package && model.URI ? `
      <p class="lead">URI: <a href="${model.URI}">${model.URI}</a></p>
      ` : ``}
      <ol class="breadcrumb">
        ${forEach(model.allOwningElements(), (parent) => `
          <li class="breadcrumb-item">
            <a class="name-ref name-${cssClass(parent)}" href="${filename(parent)}">${parent.name}</a>
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
