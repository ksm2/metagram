import { HTMLTemplate } from './HTMLTemplate';
import { ModelElement } from '../../models/uml/ModelElement';

export class OverviewTemplate extends HTMLTemplate {
  render(data: any, options: any, next: (data: any) => void): string {
    const models = data as Set<ModelElement>;
    const { baseHref, roots } = options;

    return this.main('Overview', baseHref, roots, 'overview', `
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
        const elements = [${this.forEach(models, (ownedElement) => `{"cls":"${this.cssClass(ownedElement)}","href":"${this.ref(ownedElement)}","name":"${ownedElement.name}"},`)}];
        
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

  isSupporting(data: any, options: any = {}): boolean {
    return data instanceof Set;
  }
}
