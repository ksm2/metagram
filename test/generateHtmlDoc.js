#!/usr/bin/env node
const { FileService, XMIDecoder } = require('@metagram/node');
const { Renderer } = require('@metagram/htmldoc');
const path = require('path');
const fs = require('fs');

const cacheDir = path.join(__dirname, '../var');
const outputDir = path.join(__dirname, '../out/XMIdoc/');

const fileService = new FileService();
const decoder = new XMIDecoder(fileService, cacheDir);
const renderer = new Renderer(fileService, '/XMIdoc/', outputDir);

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason.name + ' in Promise occurred!');
  console.error(reason);
});

decoder.loadURLs(
  'https://ksm2.github.io/xmi/Petrinet/v1.0.0/Petrinet.xmi',
  'http://www.omg.org/spec/MOF/20131001/MOF.xmi',
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
  return decoder.getResolvedElements().then(() => xmi)
})
.then((xmi) => {
  return renderer.render(xmi)
})
.then(() => {
  return renderer.copyAssets();
})
.then(() => {
  return renderer.renderOverview();
})
;
