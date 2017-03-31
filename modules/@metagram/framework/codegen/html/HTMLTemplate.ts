import { Template } from '../Template';
import { HTMLBundler } from '../HTMLBundler';
import { Package } from '../../models/uml/Package';
import { ModelElement } from '../../models/uml/ModelElement';
import { KNOWN_MODELS } from '../../models/index';
import { Property } from '../../models/uml/Property';
import { EnumerationLiteral } from '../../models/uml/EnumerationLiteral';
import { Operation } from '../../models/uml/Operation';
import { ParameterDirectionKind } from '../../models/uml/ParameterDirectionKind';

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
          <strong>instance of <a href="${this.ref(this.instanceOf(model)!)}">${this.instanceOf(model)!.name}</strong></a> from ${this.uriNameFor(this.instanceOf(model)!)}
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
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
        ${this.forEach(properties, (property) => `
          <li>
            <strong class="name-ref name-${this.cssClass(property)}">${property.name}</strong>
            ${property.type ? `&nbsp;<a class="name-ref name-${this.cssClass(property.type)}" href="${this.ref(property.type)}">:${property.type.name}</a>` : ``}
            <span>[${property.lower}..${property.upper === Infinity ? '*' : property.upper}]</span>
            ${property.defaultValue instanceof EnumerationLiteral ? ` 
              <a href="${this.ref(property.defaultValue)}">=${property.defaultValue.name}</a>
            ` : null !== property.defaultValue ? `
              <span>=${property.defaultValue}</span>
            ` : ``}
            ${property.association ? `&nbsp;<a class="name-ref name-association" href="${this.ref(property.association)}">${property.association.name}</a>` : ``}
            ${this.forEach(property.comments, (comment) => `
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
        ${this.forEach(operations, (operation) => `
          <li>
            <strong class="name-ref name-${this.cssClass(operation)}">${operation.name}</strong>
            <strong>(</strong>
            ${this.forEach([...operation.ownedParameters].filter(p => p.direction !== ParameterDirectionKind.RETURN), (parameter) => `
              <strong>${parameter.name}</strong>
              ${parameter.type ? `&nbsp;<a class="name-ref name-${this.cssClass(parameter.type)}" href="${this.ref(parameter.type)}">:${parameter.type.name}</a>` : ``}
              ${parameter.defaultValue instanceof EnumerationLiteral ? ` 
                <a href="${this.ref(parameter.defaultValue)}">=${parameter.defaultValue.name}</a>
              ` : null !== parameter.defaultValue ? `
                <span>=${parameter.defaultValue}</span>
              ` : ``}
              `, '<strong>,</strong>')}
            <strong>)</strong>
            ${operation.type ? `&nbsp;<a class="name-ref name-${this.cssClass(operation.type)}" href="${this.ref(operation.type)}">:${operation.type.name}</a>` : ``}
            ${this.forEach(operation.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
  }
}
