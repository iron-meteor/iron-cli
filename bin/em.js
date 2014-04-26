#!/usr/bin/env node

var Fiber = require('fibers');
var argv = require('minimist')(process.argv.slice(2));
var args = argv._;

var em = require('../lib/em.js');

Fiber(function () {
   console.log('args 1: ', args, 'argv', argv);
  em.run(args, argv);
}).run();
