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
  .then(model => Promise.all(['json', 'xmi'].map(_ => serializer.serialize(model, _, `resources/out.${_}`))))
  .catch(err => console.error(err))
;
