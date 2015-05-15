// var fs = require('fs');
var path = require('path');
var _ = require('underscore');

Command.create({
  name: 'deploy',
  usage: 'iron deploy <environment>',
  description: 'Deploy an app using mup.',
  examples: [
    'iron deploy dev',
    'iron deploy development',
    'iron deploy pro',
    'iron deploy production'
  ]
}, function (args, opts) {
  if (args.length < 1)
    throw new Command.UsageError;

  var environment = args[0];
  var DEFAULT_DEPLOYS = ['dev', 'development', 'pro', 'production'];

  if (!_.contains(DEFAULT_DEPLOYS, environment))
    throw new Command.UsageError;

  if (environment === 'dev')
    environment = 'development';

  if (environment === 'pro')
    environment = 'production';

  var cwd = path.join(this.pathFromProject(), 'deploy', environment);
  var command = 'mup deploy';

  this.execSync(command, {cwd: cwd});
});