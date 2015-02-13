var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Fiber = require('fibers');
var Future = require('fibers/future');
var Table = require('cli-table');
var cli = require('cli-color');
var spawn = require('child_process').spawn;

Command = require('./command.js');
CurrentConfig = require('./config');

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

    console.log(header('Commands: '));

    var commands = _.sortBy(this._commands, function (g) {
      return g.name;
    });

    _.each(commands, function (g) {
      table.push([
        g.name,
        g.description()
      ])
    });

    console.log(table.toString());
  }
}, function (args, opts) {
  var command = args[0] || 'run';

  if (this.findSubCommand(command)) {
    return this.runSubCommand(command, args.slice(1), opts);
  } else {
    // if the command wasn't found, but it's a valid meteor command,
    // proxy it to meteor. If it's not a valid meteor command then
    // this method throws a UsageError which will show the help.
    return this.maybeProxyCommandToMeteor();
  }
});

em.Command = Command;
em.Generator = require('./generator.js');

requireAll('commands');
requireAll('generators');

module.exports = em;
