import { ModelElement } from '@metagram/models';
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
