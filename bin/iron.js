#!/usr/bin/env node

var Fiber = require('fibers');
var argv = require('minimist')(process.argv.slice(2));
var args = argv._;
var em = require('../lib/em.js');

global.IRON_COMMAND_PATH = __dirname;

Fiber(function () {
  em.run(args, argv);
}).run();
