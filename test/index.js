#!/usr/bin/env node
// const mi = require('@metagram/interchange');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../var');
// const opts = {
//   encoders: {
//     xmi: new mi.XMIEncoder(fileService, cacheDir),
//     json: new mi.JSONEncoder(fileService, cacheDir),
//   },
// };
// const serializer = new mi.Serializer(opts);
//
//
//
//
//
// serializer.deserialize('xmi', 'http://www.omg.org/spec/UML/20131001/UMLDI.xmi')
//   .then(model => Promise.all(['json', 'xmi'].map(_ => serializer.serialize(model, _, `resources/out.${_}`))))
//   .catch(err => console.error(err))
// ;

const mi = require('../dest/model');

const fileService = new mi.FileService();

const decoder = new mi.XMIDecoder(fileService, cacheDir);

const reflector = new mi.Reflector();

decoder.loadURL('http://www.omg.org/spec/UML/20131001/UML.xmi')
  .then((xmi) => {
    // console.dir(xmi.content.values().next().value.packagedElements.values().next().value);
    const packageClass = reflector.reflectClass(xmi.getChildren().values().next().value);
    console.dir(packageClass);

    const x = {};
    const queue = [[x, xmi]];
    while (queue.length) {
      const [target, element] = queue.shift();
      const props = reflector.getProperties(element.constructor);

      for (let prop of props) {
        const value = element[prop];

        if (typeof value !== 'object') {
          target[prop] = value;
          continue;
        }

        if (value instanceof Set) {
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
