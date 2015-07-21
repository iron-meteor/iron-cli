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
 * Returns an object with the type and engine given a srcpath.
 * For example, given foo.bar.baz, returns { type: 'bar', engine: 'baz' }
 */
module.exports.engineAndTypeFromFilepath = function engineAndTypeFromFilepath(srcpath) {
  var re = /\.([A-Za-z0-9]+)/g;
  var matches = srcpath.match(re);

  if (!matches) return { type: undefined, engine: undefined };

  // matches can be an array of n length. I'll assume the last entry is the
  // engine, and the one before that the type. If there's only one entry I'll
  // assume the engine and type are the same. For example, template.js.js is
  // equivalent to template.js
  var engine = matches.pop();
  var type = matches.pop() || engine;

  if (engine)
    engine = engine.replace('.', '');

  if (type)
    type = type.replace('.', '');

  return {
    type: type,
    engine: engine
  };
};

/**
 * If we have a srcpath of foo/bar.js and an engine for js that maps to coffee,
 * then rewrite the path to foo/bar.js.coffee.
 *
 * The schema for templates looks like this:
 *
 * <template_name>.<type>[.<engine>]
 *
 * You should omit the engine in the template file name if it's the same as the
 * type. So instead of mytemplate.js.js you would just create mytemplate.js and
 * it's assumed that the engine is js.
 *
 * The path paramter to this function is automatically adjusted to look for the
 * template file for the configured engine. For example, if your js engine is
 * 'coffee' then a src path of '/path/to/template.js' will be translated to
 * '/path/to/template.js.coffee'.
 *
 */
module.exports.rewriteSourcePathForEngine = function rewriteSourcePathForEngine(/* path parts */) {
  var config = CurrentConfig.get();
  var srcpath = _.toArray(arguments).join(path.sep);

  var engineAndType = this.engineAndTypeFromFilepath(srcpath);
  var fileType = engineAndType.type;

  if (!config || !config.engines || !config.engines[fileType])
    return srcpath;

  var engine = config.engines[engineAndType.type];
  var findTypeRe = new RegExp(fileType + '\\S*$');

  if (engine === fileType)
    return srcpath.replace(findTypeRe, fileType);
  else
    return srcpath.replace(findTypeRe, fileType + '.' + engine);

  return ret;
};

/**
 * Given a path of ./foo.bar.baz of the schema ./foo.<type>.<engine>, rewrite
 * the destination path to only use the engine extension. For example,
 *
 * foo.css.less would be rewritten to be foo.less.
 */
module.exports.rewriteDestinationPathForEngine = function rewriteDestinationPathForEngine(/* path parts */) {
  var config = CurrentConfig.get();
  var destpath = _.toArray(arguments).join(path.sep);
  var fileType = this.engineAndTypeFromFilepath(destpath).type;

  // get the engine from config for the given type
  var engine = config.engines[fileType];

  // replace everything after the file type with the new
  // engine extensions
  var replaceTypeWithEngineRe = new RegExp(fileType + '\\S*$');

  if (!fileType || !engine)
    return destpath;
  else
    return destpath.replace(replaceTypeWithEngineRe, engine);
};

/**
 * Given a source file with a name that follows this schema:
 *
 * <template_name>.<type>[.engine]
 *
 * Iff there is an engine defined, make sure this template file is the right one
 * for the given engine. If there is no engine defined, assume the file is okay
 * and return true.
 */
module.exports.isTemplateForEngine = function isTemplateForEngine(/* path parts */) {
  var config = CurrentConfig.get();

  if (!config) {
    throw new Error("No configuration so can't determine engines.");
  }

  var srcpath = _.toArray(arguments).join(path.sep);
  var engineAndType = this.engineAndTypeFromFilepath(srcpath);

  // if the file doesn't have an extension return true
  if (!engineAndType.type || !engineAndType.engine)
    return true;

  var configuredEngine = config.engines[engineAndType.type];

  // if we haven't explicitly declared an engine, assume it's okay
  if (!configuredEngine)
    return true;

  // ok we have a configured engine and a file engine so
  // let's see if they match.
  return configuredEngine === engineAndType.engine;
}

/**
 * Returns a path relative to lib/templates, with the source path
 * rewritten to use the appropriate engine. See the rewriteSourcePathForEngine
 * method above.
 */
module.exports.pathFromTemplates = function pathFromTemplates(/* path parts */) {
  var srcpath = this.rewriteSourcePathForEngine.apply(this, arguments);
  // returns the path to the template with the extension
  // possibly rewritten for the currently configured engine.
  return this.pathFromNpmModule('lib/templates', srcpath);
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
 * found the function returns false. Rewrites the source path to use
 * the appropriate engine. See the rewriteSourcePathForEngine method above.
 */
module.exports.pathFromApp = function pathFromApp(/* path parts */) {
  var srcpath = this.rewriteSourcePathForEngine.apply(this, arguments);
  var appDirectory = this.findAppDirectory();
  return appDirectory ? path.join(appDirectory, srcpath) : false;
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
 * A data context can be passed as the last paramter. This function
 * let's us get a compiled template result without writing to a file. It
 * can be useful when you want to inject some template content into an
 * existing file, for example.
 */
module.exports.templateContent = function templateContent(srcpath, context) {
  var tmplpath = this.pathFromTemplates(srcpath);
  if (!this.isFile(tmplpath)) {
    throw new Error("Couldn't find a source template in " + JSON.stringify(tmplpath));
  }

  var contents = fs.readFileSync(tmplpath, 'utf8');
  return ejs.render(contents, context || {}).trim();
};

/**
 * Compile and write an ejs template from the srcpath to the destpath. The
 * destpath is rewritten for the given engine. For example, if your js
 * engine is 'coffee' then '/path/to/dest.js' will be rewritten to
 * 'path/to/dest.coffee'
 */
module.exports.template = function template(srcpath, destpath, context) {
  var renderedTemplate = this.templateContent(srcpath, context) + '\n';
  destpath = this.rewriteDestinationPathForEngine(destpath);
  var ret = this.createFile(destpath, renderedTemplate)
  return ret;
};

/**
 * Returns an array of all directory entries resursively.
 */
module.exports.directoryEntries = function directoryEntries(srcpath) {
  var self = this;
  var entries = [];

  fs.readdirSync(srcpath);

  _.each(fs.readdirSync(srcpath), function(entry) {
    var fullEntryPath = path.join(srcpath, entry);
    entries.push(fullEntryPath)
    if (self.isDirectory(fullEntryPath))
      entries = entries.concat(self.directoryEntries(fullEntryPath));
  });

  return entries;
};

/**
 * Recursively copies a template directory (from the lib/templates directory) to
 * the dest path following these rules:
 *
 *  1.  All folders in the srcpath are copied to destpath, building the folder
 *      hierarchy as needed.
 *  2.  Files matching the current engines (e.g. html/jade, js/coffee,
 *      css/scss/less) are copied. Files not matching any current engines are
 *      ignored.
 *  3.  All files are compiled through ejs with the data context optionally
 *      provided as a last parameter.
 */
module.exports.copyTemplateDirectory = function copyTemplateDirectory(srcpath, destpath, context) {
  var self = this;
  var fullSourcePath = this.pathFromTemplates(srcpath);

  function withoutTemplatePath(fullpath) {
    return fullpath.replace(self.pathFromTemplates(), '');
  }

  function toDestPath(src) {
    return src.replace(fullSourcePath, destpath);
  }

  // first create the destination directory
  if(!self.createDirectory(destpath, context)) {
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
      self.copyTemplateDirectory(relSrcPath, destPath, context);
    } else if (self.isFile(fullEntryPath) && self.isTemplateForEngine(fullEntryPath)) {
      // copy over the file
      self.template(relSrcPath, destPath, context);
    }
  });

  return true;
};

/**
 * Inject content at the end of the file. If the file
 * doesn't exist yet, create it.
 */
module.exports.injectAtEndOfFile = function injectAtEndOfFile(filepath, content) {
  var fileContent;

  if (!this.isFile(filepath)) {
    return this.createFile(filepath, content);
  } else {
    fileContent = fs.readFileSync(filepath, 'utf8');
    fileContent = fileContent + '\n' + content;
    fs.writeFileSync(filepath, fileContent);
    this.logSuccess('updated ' + filepath);
    return true;
  }
};

/**
 * Inject content at the end of the section which begins with the 'begin'
 * parameter and ends with 'end' parameter. The begin and end parameters
 * should be regular expressions.
 */
module.exports.injectIntoFile = function injectIntoFile(filepath, content, begin, end) {
    if (!this.isFile(filepath)) {
      this.logError("No file found to inject content into at path " + JSON.stringify(filepath));
      return false;
    }

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
    return true;
};
