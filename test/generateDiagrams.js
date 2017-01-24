#!/usr/bin/env node
const mi = require('../dest/server');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../var');
const outputDir = path.join(__dirname, '../out');

const fileService = new mi.FileService();
const decoder = new mi.XMIDecoder(fileService, cacheDir);
const reflector = new mi.Reflector();

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason.name + ' in Promise occurred!');
  console.error(reason);
});

decoder.loadURL('https://ksm2.github.io/xmi/Petrinet/v1.0.0/Petrinet.xmi')
.then((xmi) => {
  decoder.printErrors();
  const diagrams = xmi.contents;
  return Promise.all(Array.from(diagrams).map((diagram) => {
    if (!(diagram instanceof mi.Diagram)) return Promise.resolve();
    const bounds = diagram.calcAllElementBounds();
    const canvas = new mi.NodeCanvas(bounds.x + bounds.width, bounds.y + bounds.height, 'svg');
    canvas.diagram = diagram;
    return canvas.saveToFile(path.join(outputDir, `${diagram.name}.svg`));
  }));
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
