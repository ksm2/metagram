import { ModelElement } from '../../models/ModelElement';
import { forEach } from './helpers';

export default function (title: string, baseHref: string, roots: Set<ModelElement>, active: string, body: string) {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <base href="${baseHref}">
  <title>Metagram Specifications – ${title}</title>
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/jquery-3.1.1.min.js"></script>
  <script async src="js/bootstrap.min.js"></script>
</head>
<body>
  <nav class="navbar fixed-top navbar-toggleable-md navbar-inverse bg-primary">
    <div class="container">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="index.html">Metagram Specifications</a>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item${active === 'index' ? ' active' : ''}">
            <a class="nav-link" href="index.html">Home</a>
          </li>
          <li class="nav-item${active === 'overview' ? ' active' : ''}">
            <a class="nav-link" href="overview.html">Overview</a>
          </li>
          ${forEach(roots, (root) => `
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
