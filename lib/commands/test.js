var Command = em.Command;
var path = require('path');
var Table = require('cli-table');
var _ = require('underscore');
var util = require('util');
var cli = require('cli-color');

Command.create({
  name: 'test',
  usage: 'iron test',
  description: 'Try out various things in development',
  examples: []
}, function (args, opts) {
  this.copyTemplateDirectory('app', 'app', {data: {app: 'hello-world'}});
});
