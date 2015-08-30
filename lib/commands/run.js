var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var source = require('shell-source');
var Future = require('fibers/future');
var _ = require('underscore');

var syncSource = function (filepath) {
  var future = new Future;
  source(filepath, future.resolver());
  return future.wait();
};

Command.create({
  name: 'run',
  usage: 'iron run [--use-build] [--env]',
  description: 'Run your app for a given environment.'
}, function (args, opts) {

  if (!this.findProjectDirectory())
    throw new Command.MustBeInProjectError;

  var appEnv = process.env.NODE_ENV || 'development',
    configPath = this.pathFromProject('config', appEnv),
    envPath = path.join(configPath, 'env.sh'),
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

  // source the env file into the process environment
  // double check to avoid failing on windows
  if (process.platform !== "win32" && this.isFile(envPath)) {
    syncSource(envPath);
  }

  if (this.isFile(settingsPath)) {
    args = args.concat([
      '--settings',
      settingsPath
    ]);
  }

  // remove run and any platforms
  var r = args.concat(_.without(process.argv.slice(2), 'run', args[0]));
  return this.invokeMeteorCommand('run', r);
});
