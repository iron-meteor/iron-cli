var path = require('path');
var fs = require('fs');

/**
 * Relies on tools/logging.
 */
module.exports = {};

/**
 * Create a file at the given filepath and write the given data
 * to the file. Recursively creates the directory structure if
 * needed.
 */
module.exports.createFile = function createFile(filepath, data, opts) {
  opts = opts || {};

  try {
    var pathParts = path.normalize(filepath).split(path.sep);
    var filename = pathParts.pop();
    var dirpath = pathParts.join(path.sep);

    // make sure the directory exists before we create the
    // file.
    this.createDirectory(dirpath, opts);

    // if the file exists let's confirm with the user if we
    // should override it
    if (this.isFile(filepath)) {
      if (!this.confirm(filepath + ' already exists. Do you want to overwrite it?'))
        return false;
    }

    fs.writeFileSync(filepath, data || '');
    this.logSuccess('created ' + filepath);
    return true;
  } catch (e) {
    this.logError('Error creating file ' + filepath + '. ' + String(e));
    throw e;
  }
};

/**
 * Recursively creates a directory structure from the given
 * dirpath.
 */
module.exports.createDirectory = function createDirectory(dirpath, opts) {
  opts = opts || {};

  try {
    if (this.isDirectory(dirpath))
      return true;
    else if (this.isFile(dirpath))
      return false;

    // recursively build the directory structure
    var success = this.createDirectory(pathParts.slice(0,-1).join(path.sep), opts);

    // try to build the directory structure recursively and
    // bail out if it fails anywhere up the stack.
    var pathParts = path.normalize(dirpath).split(path.sep);
    if (!this.createDirectory(pathParts.slice(0,-1).join(path.sep), opts))
      return false;

    // make the final directory
    fs.mkdirSync(dirpath, opts.mode);

    // double check we exist now
    if (!this.isDirectory(dirpath))
      return false;

    this.logSuccess('created ' + dirpath);
    return true;
  } catch (e) {
    this.logError("Error creating directory " + dirpath + ". " + String(e));
    throw e;
  }
};

/**
 * Given a startPath or process.cwd() search upwards calling the predicate
 * function for each directory. If the predication function returns true,
 * return the current path, otherwise keep searching up until we can't go
 * any further. Returns false if no directory is found.
 *
 */
module.exports.findDirectoryUp = function findDirectoryUp(predicate, startPath) {
  var testDir = startPath || process.cwd();
  while (testDir) {
    if (predicate(testDir)) {
      break;
    }

    var newDir = path.dirname(testDir);
    if (newDir === testDir) {
      testDir = false;
    } else {
      testDir = newDir;
    }
  }

  return testDir;
};

/**
 * Given a starting filepath (process.pwd by default) returns the
 * absolute path to the root of the project directory, which contains
 * the .iron folder.
 */
module.exports.findProjectDirectory = function findProjectDirectory(filepath) {
  return this.findDirectoryUp(function predicate(curpath) {
    try {
      return this.isDirectory(path.join(curpath, '.iron'));
    } catch (e) {
      return false;
    }
  }, filepath || process.cwd());
};


/**
 * Given a starting filepath, returns the absolute path to
 * the app directory of the project. If there is no project
 * it returns false.
 */
module.exports.findAppDirectory = function findAppDirectory(filepath) {
  var projectDirectory = this.findProjectDirectory(filepath);
  return projectDirectory ? path.join(projectDirectory, 'app') : false;
};

/**
 * Returns the absolute path to the given filepath relative to the app
 * directory (e.g. my-project/app/filepath)
 */
module.exports.appPathFor = function findAppDirectory(filepath, opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || process.cwd();
  var appDirectory = this.findAppDirectory(opts.cwd);
  return appDirectory ? path.join(appDirectory, filepath) : false;
};

/**
 * Returns true if the filepath is a file.
 */
module.exports.isFile = function isFile(filepath) {
  try {
    return fs.statSync(filepath).isFile();
  } catch (e) {
    return false;
  }
};

/**
 * Returns true if the dirpath is a directory.
 */
module.exports.isDirectory = function isDirectory(dirpath) {
  try {
    return fs.statSync(dirpath).isDirectory();
  } catch (e) {
    return false;
  }
};

/**
 * Given a file return an array of each line in the file.
 */
module.exports.readFileLines = function getLines(filepath) {
  var raw = fs.readFileSync(filepath, 'utf8');
  var lines = raw.split(/\r*\n\r*/);

  while (lines.length) {
    var line = lines[lines.length - 1];
    if (line.match(/\S/))
      break;
    lines.pop();
  }

  return lines;
};
