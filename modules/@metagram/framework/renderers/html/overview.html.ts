import main from './main.html';
import { ModelElement } from '../../models';
import { forEach, cssClass } from './helpers';
import { Renderer } from '../../Renderer';

export default function (models: ModelElement[], baseHref: string, renderer: Renderer) {
  return main('Overview', baseHref, renderer.roots, 'overview', `
    <main>
      <section>
        <h2>Overview</h2>
        <form>
          <div class="form-group">
            <label for="search-input" class="form-label">Search</label>
            <input class="form-control" type="search" value="" id="search-input">
          </div>
        </form>
        <ul class="list-unstyled" id="elements">
        </ul>
      </section>
    </main>
    <script>
    $(() => {
      const elements = [${forEach(models, (ownedElement) => `{"cls":"${cssClass(ownedElement)}","href":"${renderer.ref(ownedElement)}","name":"${ownedElement.name}"},`)}];
      
      function updateSearch() {
        const text = window.location.hash.substr(1).toLowerCase();
        const regex = text ? new RegExp('(' + text + ')', 'ig') : null;
        const $els = $('#elements');
        $els.empty();
        
        elements.filter(it => it.name.toLowerCase().includes(text)).forEach(({cls, href, name}) => {
          const marked = regex ? name.replace(regex, '<mark>$1</mark>') : name;
          $els.append(${'`<li class="name-ref name-${cls}"><a href="${href}">${marked}</a></li>`'});
        });
      }
      
      $('#search-input').on('keyup', (event) => {
        window.location.hash = event.target.value;
        updateSearch();        
      });
      
      $('#search-input').val(window.location.hash.substr(1));
      updateSearch();
    });
    </script>
  `);
}
