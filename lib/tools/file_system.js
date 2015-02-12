var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var _ = require('underscore');

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
    this.logSuccess('created ' + path.relative(process.cwd(), filepath));
    return true;
  } catch (e) {
    this.logError('Error creating file ' + path.relative(process.cwd(), filepath) + '. ' + String(e));
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

    // try to build the directory structure recursively and
    // bail out if it fails anywhere up the stack.
    var pathParts = path.normalize(dirpath).split(path.sep);

    if (pathParts.length > 1) {
      if (!this.createDirectory(pathParts.slice(0,-1).join(path.sep), opts))
        return false;
    }

    // make the final directory
    fs.mkdirSync(dirpath, opts.mode);

    // double check we exist now
    if (!this.isDirectory(dirpath))
      return false;

    this.logSuccess('created ' + path.relative(process.cwd(), dirpath));
    return true;
  } catch (e) {
    this.logError("Error creating directory " + path.relative(process.cwd(), dirpath) + ". " + String(e));
    return false;
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
  var self = this;
  return this.findDirectoryUp(function predicate(curpath) {
    var testPath = path.join(curpath, '.iron');
    var isFound = self.isDirectory(path.join(curpath, '.iron'));
    return isFound;
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
 * Get a path relative to the currently executing 'iron'
 * script.
 */
module.exports.pathFromNpmModule = function pathFromNpmModule(/* path parts */) {
  var filepath = _.toArray(arguments).join(path.sep);

  // IRON_COMMAND_PATH is set in bin/iron.js. It's the absolute
  // path to the iron command executable. From there we can get
  // the npm module folder.
  return path.join(IRON_COMMAND_PATH, '../', filepath);
};

/**
 * Returns a path relative to the lib/templates directory.
 */
module.exports.pathFromTemplates = function pathFromTemplates(/* path parts */) {
  return this.pathFromNpmModule('lib/templates', _.toArray(arguments).join(path.sep)); 
};

/**
 * Returns the absolute path to the given filepath relative to the project
 * directory (e.g. my-project/filepath). Returns false if no project
 * directory is found.
 */
module.exports.pathFromProject = function pathFromProject(/* path parts */) {
  var filepath = _.toArray(arguments).join(path.sep);
  var projectDirectory = this.findProjectDirectory();
  return projectDirectory ? path.join(projectDirectory, filepath) : false;
};

/**
 * Returns the absolute path to the given filepath relative to the app
 * directory (e.g. my-project/app/filepath). If no app directory is
 * found the function returns false.
 */
module.exports.pathFromApp = function pathFromApp(/* path parts */) {
  var filepath = _.toArray(arguments).join(path.sep);
  var appDirectory = this.findAppDirectory();
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
module.exports.readFileLines = function readFileLines(filepath) {
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

/**
 * Returns a compiled template from srcpath using the ejs templating.
 * A data context can be used by providing opts.data. This function
 * let's us get a compiled template result without writing to a file. It
 * can be useful when you want to inject some template content into an
 * existing file, for example.
 *
 * Note: srcpath does not have to be the full filepath. It will return the first
 * file that matches the first part of the srcpath. This allows you to get a src
 * template that has an extension like .ejs that you don't care about.
 */
module.exports.templateContent = function templateContent(srcpath, opts) {
  opts = opts || {};

  var tmplpath = this.pathFromTemplates(srcpath);
  var tmplDir = path.dirname(tmplpath);
  var tmplFilename = path.basename(tmplpath);
  var searchFiles = fs.readdirSync(tmplDir);
  var reBeginsWithTmplFilename = new RegExp('^' + tmplFilename); 
  var searchResult = _.find(searchFiles, function predicate(filename) {
    return reBeginsWithTmplFilename.test(filename); 
  });

  if (!searchResult) {
    throw new Error("Couldn't find a source template in " + JSON.stringify(srcpath));
  }

  var contents = fs.readFileSync(path.join(tmplDir, searchResult), 'utf8');
  return ejs.render(contents, opts.data || {}).trim();
};

/**
 * Compile and write an ejs template from the srcpath to the destpath.
 */
module.exports.template = function template(srcpath, destpath, opts) {
  var renderedTemplate = this.templateContent(srcpath, opts) + '\n';
  return this.createFile(destpath, renderedTemplate, opts)
};

/**
 * Recursively copies a template directory (from the lib/templates directory) to
 * the dest path following these rules:
 *
 *  1.  All folders in the srcpath are copied to destpath, building intermediate
 *      folders if needed.
 *  2.  Files matching the current engines (e.g. html/jade, js/coffee,
 *      css/scss/less) are copied. Files not matching any current engines are
 *      ignored. 
 *  3.  All files are compiled through ejs with the data context provided in
 *      opts.
 *  4.  srcpath and destpath must be directories
 */
module.exports.copyTemplateDirectory = function copyTemplateDirectory(srcpath, destpath, opts) {
  var self = this;
  var fullSourcePath = this.pathFromTemplates(srcpath);

  function withoutTemplatePath(fullpath) {
    return fullpath.replace(self.pathFromTemplates(), '');
  }

  function toDestPath(src) {
    return src.replace(fullSourcePath, destpath);
  }

  // first create the destination directory
  if(!self.createDirectory(destpath, opts)) {
    this.logError("Unable to create destination directory " + JSON.stringify(destpath));
    return false;
  }


  _.each(fs.readdirSync(fullSourcePath), function(srcEntryName) {
    var fullEntryPath = path.join(fullSourcePath, srcEntryName);
    var relSrcPath = withoutTemplatePath(fullEntryPath);
    var destPath = toDestPath(fullEntryPath);

    if (self.isDirectory(fullEntryPath)) {
      // recurse into the directory but we have to remove the
      // templates path prefix. So 'lib/templates/app/both' becomes 'app/both'
      self.copyTemplateDirectory(relSrcPath, destPath, opts);
    } else if (self.isFile(fullEntryPath)) {
      // copy over the file
      //console.log("template: ", relSrcPath, destPath);
      self.template(relSrcPath, destPath, opts);
    }
  });
};

/**
 * Inject content at the end of the file.
 */
module.exports.injectAtEndOfFile = function injectAtEndOfFile(filepath, content) {
  var fileContent = fs.readFileSync(filepath, 'utf8');
  fileContent = fileContent + '\n' + content;
  fs.writeFileSync(filepath, fileContent);
  this.logSuccess('updated ' + filepath);
};

/**
 * Inject content at the end of the section which begins with the 'begin'
 * parameter and ends with 'end' parameter. The begin and end parameters
 * should be regular expressions.
 */
module.exports.injectIntoFile = function injectIntoFile(filepath, content, begin, end) {
    var raw = fs.readFileSync(filepath, 'utf8');

    // matches a beginning, anything in the middle, and the end
    var anything = '[\\s\\S]*';
    var group = function (exp) {
      return '(' + exp + ')';
    };
    var re = new RegExp(
      group(anything) +
      group(begin.source) +
      group(anything) +
      group(end.source) +
      group(anything),
      'i'
    );

    // [0:before, 1:begin, 2:middle, 3:end, 4:after]
    var allParts = re.exec(raw);

    if (!allParts)
      throw new Error("injectIntoFile didn't find a match: " + re.source);

    var parts = allParts.slice(1);
    parts.splice(3, 0, content);
    fs.writeFileSync(filepath, parts.join(''));
    this.logSuccess('updated ' + filepath);
};
