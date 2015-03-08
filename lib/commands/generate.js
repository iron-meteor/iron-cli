var path = require('path');
var Table = require('cli-table');
var _ = require('underscore');
var util = require('util');
var cli = require('cli-color');
var Fiber = require('fibers');

Command.create({
  name: 'generate',
  aliases: ['g'],
  usage: 'iron {generate, g}:<generator> <name> [--dir] [--where]',
  description: 'Generate different scaffolds for your project.',
  examples: [
    'iron generate:scaffold todos',
    'iron g:scaffold todos',
    'iron g:view todos/todo_item',
    'iron g:controller todos/todo_item --where "server"'
  ],

  onUsage: function () {
    var header = cli.blackBright;
    var table = new Table({});

    console.log(header('Generators:'));

    var generators = _.sortBy(Iron._generators, function (g) {
      return g.name;
    });

    _.each(generators, function (g) {
      table.push([
        g.name,
        g.description()
      ])
    });

    console.log(table.toString());
  }
}, function (args, opts) {
  var self = this;
  var gName = args[0];

  // Invoke the specified generator
  Iron.findGenerator(gName).invoke(args.slice(1), opts);

  // Look in config.json for any other generators that are
  // supposed to be ran with the specified one, and run them.
  CurrentConfig.withConfigFile(function() {
    if (! _.isUndefined(this.CurrentConfig.get().generators[gName])) {
      var gOptions = this.CurrentConfig.get().generators[gName];
      for (g in gOptions) {
        if (gOptions[g])
          Iron.findGenerator(g).invoke(args.slice(1), opts);
      }
    }
  });

});
