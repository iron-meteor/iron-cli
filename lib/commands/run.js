var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var dotenv = require('dotenv');

Command.create({
  name: 'run',
  usage: 'iron run [--use-build] [--env]',
  description: 'Run your app for a given environment.'
}, function (args, opts) {
  var appEnv = opts.env || process.env.NODE_ENV || 'development';

  if (!this.findProjectDirectory())
    throw new Command.MustBeInProjectError;

  var configPath = this.pathFromProject('config', appEnv);
  var envPath = path.join(configPath, 'env.sh');
  var settingsPath = path.join(configPath, 'settings.json');

  // source the env file into the process environment

  if (this.isFile(envPath)) {
    dotenv._getKeysAndValuesFromEnvFilePath(envPath);
    dotenv._setEnvs();
  }

  if (this.isFile(settingsPath)) {
    args = args.concat([
      '--settings',
      settingsPath
    ]);
  }

  return this.invokeMeteorCommand('run', args.concat(process.argv.slice(3)));
});
