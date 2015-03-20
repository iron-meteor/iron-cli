var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var Future = require('fibers/future');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = {};

/**
 * Creates an empty meteor project with the given name
 * at the given opts.cwd.
 */
module.exports.createEmptyMeteorProject = function createEmptyMeteorProject(name, opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || '.';

  var appPath = path.join(opts.cwd, name);
  var meteorPath = path.join(appPath, '.meteor');

  // only do this if a meteor project doesn't already exist at
  // the given location.
  if (this.isDirectory(meteorPath)) {
    this.logWarn('Meteor project already exists at ' + JSON.stringify(appPath));
    return false;
  }

  try {
    var spinHandle = this.logWithSpinner('Creating project ', name);
    var appDirectory = path.join(opts.cwd, name);
    this.execSync('meteor create ' + name, {cwd: opts.cwd, silent: true});
    _.each(fs.readdirSync(appDirectory), function (entryPath) {
      if (entryPath === '.git') return;
      if (entryPath === '.meteor') return;
      fs.unlinkSync(path.join(appDirectory, entryPath));
    });
  } finally {
    // stop the spinny thing
    spinHandle.stop();
  }

  // if we got this far we're good to go
  this.logSuccess('Meteor app created');
  return true;
};

/**
 * Installs a meteor package in the app directory for the project. It doesn't
 * matter where the cwd directory is, as long as you're in an iron project
 * and there's an app folder. If the app folder isn't a meteor project the
 * meteor cli will throw an error.
 */
module.exports.installMeteorPackage = function installMeteorPackage(pkg, opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || '.';

  var appDirectory = this.findAppDirectory(opts.cwd);

  if (!appDirectory) {
    this.logError("Couldn't find an app directory to install " + JSON.stringify(pkg) + " into.");
    return false;
  }

  var spinHandle = this.logWithSpinner('Installing the package ', pkg);

  try {
    this.execSync('meteor add ' + pkg, {cwd: appDirectory});
  } finally {
    spinHandle.stop();
  }

  this.logSuccess('\u2714', pkg);
};

/**
 * Returns true if a package has been installed.
 */
module.exports.hasMeteorPackage = function hasMeteorPackage(pkg, opts) {
  var self = this;
  var packageFilePath = this.appPathFor(path.join('.meteor', 'packages'), opts)

  // if this happens we didn't find a meteor
  // directory
  if (!packageFilePath)
    return false;

  var packageLines = this.getLines(packageFilePath);
  var packages = [];
  _.each(packageLines, function (line) {
    line = self.trimLine(line);
    if (line !== '')
      packages.push(line);
  });

  return ~packages.indexOf(name);
};

/**
 * Proxy valid meteor commands to the meteor command line tool. The meteor
 * command will be run inside the app directory.
 */
module.exports.maybeProxyCommandToMeteor = function maybeProxyCommandToMeteor() {
  var validMeteorCommands = [
    'run',
    'debug',
    'update',
    'add',
    'remove',
    'list',
    'add-platform',
    'install-sdk',
    'remove-platform',
    'list-platforms',
    'configure-android',
    'build',
    'shell',
    'mongo',
    'reset',
    'deploy',
    'logs',
    'authorized',
    'claim',
    'login',
    'logout',
    'whoami',
    'test-packages',
    'list-sites',
    'publish-release',
    'publish',
    'publish-for-arch',
    'search',
    'show'
  ];

  var allArgs = process.argv.slice(2);
  var cmd = allArgs[0];
  var args = allArgs.slice(1);

  if (!_.contains(validMeteorCommands, cmd))
    throw new Command.UsageError;

  if (!this.findAppDirectory())
    throw new Command.UsageError;

  return this.invokeMeteorCommand(cmd, args);
};

/**
 * Invoke a meteor command with given array arguments. Does not
 * check whether the command is valid. Useful when we know we want
 * to run a command and we can skip the valid meteor commands
 * check.
 */
module.exports.invokeMeteorCommand = function invokeMeteorCommand(cmd, args) {
  this.logSuccess("> meteor " + [cmd].concat(args).join(' '));
  console.log('');

  var future = new Future;

  var child = spawn('meteor', [cmd].concat(args), {
    cwd: this.findAppDirectory(),
    env: process.env
  });

  child.stdout.on('data', function stdout(data) {
    console.log(data.toString());
  });

  _.each(['SIGINT', 'SIGHUP', 'SIGTERM'], function (sig) {
    process.once(sig, function () {
      process.kill(child.pid, sig);
      process.kill(process.pid, sig);
    });
  });

  child.on('exit', function() {
    future.return();
  });

  future.wait();
};
