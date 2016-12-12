#!/usr/bin/env node
const mi = require('./dest');

const l = new mi.Loader();

l.loadFromXMI('http://www.omg.org/spec/UML/20131001/UMLDI.xmi')
  .then((model) => {
    return Promise.all([l.saveToJSON(model, 'resources/out.json'), l.saveToXMI(model, 'resources/out.xmi')]);
  })
  .catch((err) => console.error(err))
;
