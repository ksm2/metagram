#!/usr/bin/env node
const mi = require('../dest');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../var');

const fileService = new mi.FileService();
const decoder = new mi.XMIDecoder(fileService, cacheDir);
const reflector = new mi.Reflector();
const renderer = new mi.Renderer(fileService, '/', path.join(__dirname, '../out'));

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason.name + ' in Promise occurred!');
  console.error(reason);
});

decoder.loadURLs(
  'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi',
  'http://www.omg.org/spec/UML/20131001/UML.xmi',
  'http://www.omg.org/spec/UML/20131001/StandardProfile.xmi',
  'http://www.omg.org/spec/UML/20131001/UMLDI.xmi',
  'http://www.omg.org/spec/XMI/20131001/XMI-model.xmi',
  'http://www.omg.org/spec/DD/20131001/DC.xmi',
  'http://www.omg.org/spec/DD/20131001/DI.xmi',
  'http://www.omg.org/spec/DD/20131001/DG.xmi'
)
  .then((xmi) => {
    decoder.printErrors();
    xmi.name = 'Index';
    return decoder.getResolvedElements()
      .then(() => {
        return renderer.render(xmi)
      })
      .then(() => {
        return renderer.copyAssets();
      }).then(() => {
        return xmi;
      })
    ;
  })
  // .then((xmi) => {
  //   const x = {};
  //   const queue = [[x, xmi]];
  //   const weakMap = new WeakMap();
  //   while (queue.length) {
  //     const [target, element] = queue.shift();
  //
  //     if (weakMap.has(element)) {
  //       target['xmi:idref'] = weakMap.get(element);
  //       continue;
  //     }
  //     target['xmi:id'] = element.ID;
  //     weakMap.set(element, target['xmi:id']);
  //
  //     const props = reflector.getProperties(element.constructor);
  //
  //     for (let prop of props) {
  //       const value = element[prop];
  //
  //       if (value === Infinity) {
  //         target[prop] = '*';
  //         continue;
  //       }
  //
  //       if (value === null) {
  //         continue;
  //       }
  //
  //       if (typeof value !== 'object') {
  //         target[prop] = value;
  //         continue;
  //       }
  //
  //       if (value instanceof Set) {
  //         if (!value.size) continue;
  //
  //         target[prop] = [];
  //         for (let child of value) {
  //           const o = {};
  //           target[prop].push(o);
  //           queue.push([o, child]);
  //         }
  //         continue;
  //       }
  //
  //       target[prop] = {};
  //       queue.push([target[prop], value]);
  //     }
  //   }
  //
  //   const json = JSON.stringify(x, null, '  ');
  //   fs.writeFileSync(path.join(cacheDir, 'out.json'), json);
  //   console.log('Finished writing!');
  // })
;
