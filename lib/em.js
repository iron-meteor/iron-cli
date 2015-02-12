var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Fiber = require('fibers');
var Future = require('fibers/future');
var Command = require('./command.js');
var Table = require('cli-table');
var cli = require('cli-color');
var Config = require('./config.js');
var spawn = require('child_process').spawn;

var requireAll = function (relpath) {
  var dirpath = path.join(__dirname, relpath);
  var files = fs.readdirSync(dirpath);
  _.each(files, function (file) {
    require(path.join(dirpath, file));
  });
};

em = new Command({
  name: 'iron',
  description: 'A command line scaffolding tool for Meteor applications.',
  usage: 'iron <command> [<args>] [<opts>]',
  examples: [
    'iron generate:scaffold todos',
    'iron generate:view todos/todo_item'
  ],

  onUsage: function () {
    var header = cli.blackBright;
    var table = new Table({});

    var commands = _.sortBy(this._commands, function (g) {
      return g.name;
    });

    _.each(commands, function (g) {
      table.push([
        g.name,
        g.description()
      ])
    });

  }
}, function (args, opts) {
  //XXX add default command
  //XXX proxy to meteor if needed
  var command = args[0];
  this.runSubCommand(command, args.slice(1), opts);
});

em.Command = Command;
em.Generator = require('./generator.js');

requireAll('commands');
requireAll('generators');

module.exports = em;
