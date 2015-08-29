var path = require('path');
var Future = require('fibers/future');
var _ = require('underscore');

Command.create({
  name: 'deploy',
  usage: 'iron deploy <name> [--env]',
  description: 'Deploy your app to Meteor servers.'
}, function (args, opts) {
  if (args.length < 1)
    throw new Command.UsageError;

  if (!this.findProjectDirectory())
    throw new Command.MustBeInProjectError;

  var appEnv = process.env.NODE_ENV || 'development',
    configPath = this.pathFromProject('config', appEnv),
    settingsPath;

  if (opts.env) {
    appEnv = opts.env;
    configPath = this.pathFromProject('config', appEnv);
  }

  // allow settings override
  if (opts.settings) {
    settingsPath = opts.settings;
  } else {
    settingsPath = path.join(configPath, 'settings.json');
  }

  if (this.isFile(settingsPath)) {
    args = args.concat([
      '--settings',
      settingsPath
    ]);
  }

  // remove deploy and any platforms
  var r = args.concat(_.without(process.argv.slice(2), 'deploy', args[0]));
  return this.invokeMeteorCommand('deploy', r);
});
