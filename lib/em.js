var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var Fiber = require('fibers');
var Future = require('fibers/future');
var Command = require('./command.js');
var Table = require('cli-table');
var cli = require('cli-color');
var Config = require('./config_data.js');

var requireAll = function (relpath) {
  var dirpath = path.join(__dirname, relpath);
  var files = fs.readdirSync(dirpath);
  _.each(files, function (file) {
    require(path.join(dirpath, file));
  });
};

em = new Command({
  name: 'em',
  description: 'A command line scaffolding tool for Meteor applications.',
  usage: 'em <command> [<args>] [<opts>]',
  examples: [
    'em generate:scaffold todos',
    'em generate:view todos/todo_item'
  ],

  onUsage: function () {
    var header = cli.blackBright;
    var table = new Table({});

    console.log(header('Available Commands:'));

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
   Config.options();
   // console.log("config: ", Config.options);
  // var command = args[0];
  // console.log("command 1: ", command);
  // if (!command)
  //   throw new Command.UsageError;
  // this.runSubCommand(command, args.slice(1), opts);
});

em.Command = Command;
em.Generator = require('./generator.js');

requireAll('commands');
requireAll('generators');

module.exports = em;
