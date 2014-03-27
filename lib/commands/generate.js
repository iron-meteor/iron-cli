var Command = em.Command;
var path = require('path');
var Table = require('cli-table');
var _ = require('underscore');
var util = require('util');
var cli = require('cli-color');

Command.create({
  name: 'generate',
  aliases: ['g'],
  usage: 'em {generate, g}:<generator> <name> [--dir] [--where]',
  description: 'Generate different scaffolds for your project.',
  examples: [
    'em generate:scaffold todos',
    'em g:scaffold todos',
    'em g:view todos/todo_item',
    'em g:controller todos/todo_item --where "server"'
  ],

  onUsage: function () {
    var header = cli.blackBright;
    var table = new Table({});

    console.log(header('Generators:'));

    var generators = _.sortBy(em._generators, function (g) {
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
  var gName = args[0];
  var generator = em.findGenerator(gName);

  if (!generator)
    throw new Command.UsageError;

  var newArgs = args.slice(1);
  var resourceName = newArgs[0];

  if (!resourceName) {
    throw new Command.UsageError;
  }

  var parts = resourceName.split(path.sep);

  if (parts.length > 1) {
    resourceName = parts.pop();
    newArgs[0] = resourceName;
    opts.dir = parts.join(path.sep);
  }

  return generator.run(newArgs, opts);
});
