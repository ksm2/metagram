import { KNOWN_MODELS } from '../../models/index';
import { EnumerationLiteral } from '../../models/uml/EnumerationLiteral';
import { ModelElement } from '../../models/uml/ModelElement';
import { Operation } from '../../models/uml/Operation';
import { Package } from '../../models/uml/Package';
import { ParameterDirectionKind } from '../../models/uml/ParameterDirectionKind';
import { Property } from '../../models/uml/Property';
import { Template } from '../Template';
import { HTMLBundler } from './HTMLBundler';

export class HTMLTemplate extends Template {
  constructor(protected bundler: HTMLBundler) {
    super();
  }

  protected cssClass(model: ModelElement): string {
    return this.bundler.cssClass(model);
  }

  protected ref(model: ModelElement): string {
    return this.bundler.generateFilename(model);
  }

  protected instanceOf(model: ModelElement): ModelElement | null {
    return this.bundler.instanceOf.get(model) || null;
  }

  protected forEach<T>(
    a: { [Symbol.iterator](): Iterator<T> },
    callback: (a: T) => string, separator: string = ''
  ): string {
    return [...a].map(callback).join(separator);
  }

  protected uriNameFor(model: ModelElement) {
    const root = model.getRoot();
    if (root instanceof Package) {
      const info = KNOWN_MODELS.get(root.URI!);
      if (info) return `${info.name} (v${info.version})`;
    }

    return model.getOrigin();
  }

  protected layout(model: ModelElement, options: any, body: string) {
    const { baseHref, roots } = options;

    return this.main(model.name!, baseHref, roots, model.getRoot().name!, `
      <header>
        <h1 class="name name-${this.cssClass(model)}">${model.name}</h1>
        <p>
        ${this.instanceOf(model) ? `
          <strong>
            <span>instance of</span>
            <a href="${this.ref(this.instanceOf(model)!)}">${this.instanceOf(model)!.name}</a>
            <span>from ${this.uriNameFor(this.instanceOf(model)!)}</span>
          </strong>
        ` : ``}
        </p>
        ${this.forEach(model.comments, (comment) => `
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
          ${this.forEach(model.allOwningElements(), (parent) => `
            <li class="breadcrumb-item">
              <a class="name-ref name-${this.cssClass(parent)}" href="${this.ref(parent)}">${parent.name}</a>
            </li>
          `)}
          <li class="breadcrumb-item active">
            <span class="name-ref name-${this.cssClass(model)}">${model.name}</span>
          </li>
        </ol>
      </header>
      <main>
        ${body}
      </main>
    `);
  }

  protected main(title: string, baseHref: string, roots: Set<ModelElement>, active: string, body: string) {
    return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <base href="${baseHref}">
  <title>Metagram – ${title}</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/jquery-3.1.1.min.js"></script>
  <script async src="js/bootstrap.min.js"></script>
</head>
<body>
  <nav class="navbar navbar-inverse navbar-fixed-top navbar-toggleable-md">
    <div class="container">
      <div class="navbar-header">
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="index.html">Metagram</a>
      </div>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="nav navbar-nav">
          <li class="nav-item${active === 'index' ? ' active' : ''}">
            <a class="nav-link" href="index.html">Home</a>
          </li>
          <li class="nav-item${active === 'overview' ? ' active' : ''}">
            <a class="nav-link" href="overview.html">Overview</a>
          </li>
          ${this.forEach(roots, (root) => `
          <li class="nav-item${active === root.name ? ' active' : ''}">
            <a class="nav-link" href="${root.name}.html">${root.name}</a>
          </li>
          `)}
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    ${body}
  </div>
</body>
</html>
  `;
  }

  protected attributes(properties: Set<Property>) {
    return properties.size ? `<section>
      <h2>Owned Attributes</h2>
      <ul class="list-unstyled">
        ${this.forEach(properties, (prop) => `
          <li>
            <strong class="name-ref name-${this.cssClass(prop)}">${prop.name}</strong>
            ${prop.type ?
              `&nbsp;<a class="name-ref name-${this.cssClass(prop.type)}" href="${this.ref(prop.type)}">:${prop.type.name}</a>` : ``}
            <span>[${prop.lower}..${prop.upper === Infinity ? '*' : prop.upper}]</span>
            ${prop.defaultValue instanceof EnumerationLiteral ? `
              <a href="${this.ref(prop.defaultValue)}">=${prop.defaultValue.name}</a>
            ` : null !== prop.defaultValue ? `
              <span>=${prop.defaultValue}</span>
            ` : ``}
            ${prop.association ?
              `&nbsp;<a class="name-ref name-association" href="${this.ref(prop.association)}">${prop.association.name}</a>` : ``}
            ${this.forEach(prop.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
  }

  protected operations(operations: Set<Operation>) {
    return operations.size ? `<section>
      <h2>Owned Operations</h2>
      <ul class="list-unstyled">
        ${this.forEach(operations, (op) => `
          <li>
            <strong class="name-ref name-${this.cssClass(op)}">${op.name}</strong>
            <strong>(</strong>
            ${this.forEach([...op.ownedParameters].filter((p) => p.direction !== ParameterDirectionKind.RETURN), (param) => `
              <strong>${param.name}</strong>
              ${param.type ?
                `&nbsp;<a class="name-ref name-${this.cssClass(param.type)}" href="${this.ref(param.type)}">:${param.type.name}</a>` : ``}
              ${param.defaultValue instanceof EnumerationLiteral ? `
                <a href="${this.ref(param.defaultValue)}">=${param.defaultValue.name}</a>
              ` : null !== param.defaultValue ? `
                <span>=${param.defaultValue}</span>
              ` : ``}
              `, '<strong>,</strong>')}
            <strong>)</strong>
            ${op.type ?
              `&nbsp;<a class="name-ref name-${this.cssClass(op.type)}" href="${this.ref(op.type)}">:${op.type.name}</a>` : ``}
            ${this.forEach(op.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
  }
}
