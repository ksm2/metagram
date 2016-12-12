#!/usr/bin/env node
const mi = require('./dest');

const fileService = new mi.FileService();
const opts = {
  encoders: {
    xmi: new mi.XMIEncoder(fileService),
    json: new mi.JSONEncoder(fileService),
  },
};
const serializer = new mi.Serializer(opts);

serializer.deserialize('xmi', 'http://www.omg.org/spec/UML/20131001/UMLDI.xmi')
  .then((model) => {
    return Promise.all([serializer.serialize(model, 'json', 'resources/out.json'), serializer.serialize(model, 'xmi', 'resources/out.xmi')]);
  })
  .catch((err) => console.error(err))
;
