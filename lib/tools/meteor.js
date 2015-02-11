var exec = require('child_process').exec;
var Future = require('fibers/future');
var path = require('path');

module.exports = {};

/**
 * Creates an empty meteor project with the given name
 * at the given opts.cwd.
 */
module.exports.createEmptyMeteorProject = function createEmptyMeteorProject(name, opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || '.';

  try {
    // create a nice spinner in the console
    var spinHandle = this.logWithSpinner('Creating project ', name);

    // create the meteor app. throws on error.
    this.execSync('meteor create ' + name, opts);

    // remove the cruft from the new meteor app folder. throws
    // on error.
    this.execSync('rm app.*', { cwd: path.join(opts.cwd, name) });
  } finally {
    // stop the spinny thing
    spinHandle.stop();
  }

  // if we got this far we're good to go
  this.logSuccess('Meteor app created');
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
    this.logError("Couldn't find an app directory.");
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
