#!/usr/bin/env node
const mi = require('../dest/model');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../var');

const fileService = new mi.FileService();
const decoder = new mi.XMIDecoder(fileService, cacheDir);
const reflector = new mi.Reflector();
const renderer = new mi.Renderer(fileService, '/', path.join(__dirname, '../out'));

decoder.loadURL('http://www.omg.org/spec/UML/20131001/UML.xmi')
  .then((xmi) => {
    renderer.render(xmi).then(() => {
      renderer.copyAssets();
    });
    return xmi;
  })
  .then((xmi) => {
    const x = {};
    const queue = [[x, xmi]];
    const weakMap = new WeakMap();
    while (queue.length) {
      const [target, element] = queue.shift();

      if (weakMap.has(element)) {
        target['xmi:idref'] = weakMap.get(element);
        continue;
      }
      target['xmi:id'] = element.ID;
      weakMap.set(element, target['xmi:id']);

      const props = reflector.getProperties(element.constructor);

      for (let prop of props) {
        const value = element[prop];

        if (value === Infinity) {
          target[prop] = '*';
          continue;
        }

        if (value === null) {
          continue;
        }

        if (typeof value !== 'object') {
          target[prop] = value;
          continue;
        }

        if (value instanceof Set) {
          if (!value.size) continue;

          target[prop] = [];
          for (let child of value) {
            const o = {};
            target[prop].push(o);
            queue.push([o, child]);
          }
          continue;
        }

        target[prop] = {};
        queue.push([target[prop], value]);
      }
    }

    const json = JSON.stringify(x, null, '  ');
    fs.writeFileSync(path.join(cacheDir, 'out.json'), json);
    console.log('Finished writing!');
  })
  .catch((it) => { console.error(it) })
;
