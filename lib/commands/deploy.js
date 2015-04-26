// var fs = require('fs');
var path = require('path');
var _ = require('underscore');

Command.create({
  name: 'deploy',
  usage: 'iron deploy <environment>',
  description: 'Deploy an app using mup.',
  examples: [
    'iron deploy development',
    'iron deploy production'
  ]
}, function (args, opts) {
  if (args.length < 1)
    throw new Command.UsageError;

  var environment = args[0];

  if (!_.contains(['development', 'production'], environment))
    throw new Command.UsageError;

  var cwd = path.join(this.pathFromProject(), 'deploy', environment);
  var command = 'mup deploy';

  this.execSync(command, {cwd: cwd});
});