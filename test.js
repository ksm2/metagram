#!/usr/bin/env node
const mi = require('./dest');

const l = new mi.Loader();

l.loadFromXMI('http://www.omg.org/spec/UML/20131001/UML.xmi')
  .then((model) => {
    return l.saveToJSON(model, 'resources/out.json');
  })
  .catch((err) => console.error(err))
;
