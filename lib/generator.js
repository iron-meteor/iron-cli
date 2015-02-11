var util = require('util');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var _ = require('underscore');
var Command = em.Command;

var Generator = module.exports = function Generator (opts, handler) {
  Command.prototype.constructor.apply(this, arguments);
};

util.inherits(Generator, Command);

_.extend(Generator.prototype, {
});

Generator.create = function (opts, handler, parent) {
  if (!opts)
    throw new Error('Generator.create requires some options!');

  if (!_.isFunction(handler))
    throw new Error('Generator.create requires a handler function!');

  var g = new Generator(opts, handler);
  parent = parent || em;
  parent.addGenerator(g);
  return g;
};
