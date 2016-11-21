#!/usr/bin/env node
const mi = require('./dest');

const l = new mi.Loader();
l.loadFromXMI('resources/UMLDI.umldi.xmi')
  .then((model) => {
    model.getElements().forEach(it => {
      console.log(it.getString('name'));
      console.log(it.getElement('packageMerge').getElement('mergedPackage').getType());
    });
    return l.saveToJSON(model, 'resources/out.json');
  })
  .catch((err) => console.error(err))
;
