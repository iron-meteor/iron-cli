var Command = em.Command;
var path = require('path');
var Table = require('cli-table');
var _ = require('underscore');
var util = require('util');
var cli = require('cli-color');

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
  var self = this;
  var gName = args[0];
  var generator = em.findGenerator(gName);

  if (!generator)
    throw new Command.UsageError;

  var newArgs = args.slice(1);
  opts.resourceName = newArgs[0];

  if (!opts.resourceName) {
    this.logError("Oops, you're going to need to specify a resource name like 'todos'.");
    this.logError("Here's some help for this command:");
    throw new Command.UsageError;
  }


  if (!this.findProjectDirectory())
    throw new MustBeInProjectError;

  var parts = opts.resourceName.split(path.sep);

  // pull the path part out of the <name> and put it in
  // the "dir" option.
  if (parts.length > 1) {
    opts.resourceName = parts.pop();
    newArgs[0] = opts.resourceName;
    opts.dir = _.map(parts, function(part) {
      return self.fileCase(part); 
    }).join(path.sep);
  }

  // make sure the 'where' opt is set to something,
  // 'both' by default
  opts.where = opts.where || 'both';

  if (!_.contains(['both', 'client', 'server'], opts.where)) {
    this.logError("--where must be 'both', 'client' or 'server'");
    throw new Command.UsageError;
  }

  // set the appPathPrefix depending on the 'where' options
  // --where=both => app/lib
  // --where=server => app/server
  // --where=client => app/client
  switch (opts.where) {
    case 'both':
      opts.appPathPrefix = 'lib';
      break;
    case 'server':
      opts.appPathPrefix = 'server';
      break;
    case 'client':
      opts.appPathPrefix = 'client';
      break;
    default:
      opts.appPathPrefix = '';
  }

  return generator.run(newArgs, opts);
});
