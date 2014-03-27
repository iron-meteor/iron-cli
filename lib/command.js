var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var readline = require('readline');
var Fiber = require('fibers');
var Future = require('fibers/future');
var Table = require('cli-table');
var cli = require('cli-color');

var rootPathFor = function (relpath) {
  relpath = relpath || '';
  var res = path.join(__dirname, '../', relpath);
  return res;
};

var libPathFor = function (relpath) {
  relpath = relpath || '';
  return path.join(__dirname, '../lib', relpath);
};

var findUpwards = function (predicate, startPath) {
  var testDir = startPath || process.cwd();
  while (testDir) {
    if (predicate(testDir)) {
      break;
    }

    var newDir = path.dirname(testDir);
    if (newDir === testDir) {
      testDir = null;
    } else {
      testDir = newDir;
    }
  }

  if (!testDir)
    return null;

  return testDir;
};

var Command = module.exports = function (opts, handler) {
  if (!opts)
    throw new Error("Command requires first param to be an object");

  if (!opts.name)
    throw new Error("Command requires a name");
  
  if (!_.isFunction(handler))
    throw new Error("Command requires a handler function");

  opts = this.options = _.clone(opts);
  this.name = opts.name;
  this._handler = _.bind(handler, this);
  this._commands = [];
  this._generators = [];
};

Command.prototype = {
  constructor: Command,

  match: function (nameOrAlias) {
    var names = [this.name].concat(this.options.aliases || []);
    return ~names.indexOf(nameOrAlias) ? this : false;
  },

  addCommand: function (cmd) {
    if (!(cmd instanceof em.Command))
      throw new Error("addCommand requires a Command instance");
    this._commands.push(cmd);
  },

  findCommand: function (name) {
    var cmd;
    for (var i = 0, len = this._commands.length; i < len; i++) {
      cmd = this._commands[i];
      if (cmd.match(name))
        return cmd;
    }
  },

  addGenerator: function (gen) {
    if (!(gen instanceof em.Generator))
      throw new Error("addGenerator requires a Generator instance");
    this._generators.push(gen);
  },

  findGenerator: function (name) {
    var res;
    for (var i = 0, len = this._generators.length; i < len; i++) {
      res = this._generators[i];
      if (res.match(name))
        return res;
    }
  },

  run: function (args, opts) {
    var self = this;
    args = args || [];
    opts = opts || {};

    try {
      var ret = self._handler.call(self, args, opts);

      if (opts.stayalive)
        return ret;

      if (typeof ret === 'undefined' || ret === 0)
        process.exit(ret || 0);
      else
        process.exit(ret);
    } catch (e) {
      if (e instanceof Command.UsageError) {
        self.logUsage();
      } else {
        self.logError(String(e), String(e.stack));
      }

      if (opts.stayalive)
        return 1;
      else
        process.exit(1);
    }
  },

  runSubCommand: function (command, args, opts) {
    var cmd;
    var parts;
    var firstArg;

    parts = command.split(':');
    command = parts[0];
    firstArg = parts[1];

    if (firstArg)
      args.splice(0,0,firstArg);

    if (cmd = this.findCommand(command)) {
      try {
        cmd.run(args, opts);
      } catch (e) {
        em.logError(String(e), String(e.stack));
        process.exit(1);
      }
    } else {
      throw new Command.UsageError;
    }
  },

  description: function () {
    return this.options.description || 'No description provided.';
  },

  usage: function () {
    return this.options.usage || 'No usage provided.';
  },

  examples: function () {
    return this.options.examples || [];
  },

  onUsage: function () {
    var fn = this.options.onUsage;
    fn && fn.call(this);
  },

  logUsage: function () {
    var header = cli.blackBright;

    var description = this.description();
    var usage = this.usage();
    var examples = this.examples();

    console.log();
    this.logNotice(description);
    console.log();
    console.log(header('Usage: ') + usage);
    console.log();
    console.log(header('Examples:'));

    _.each(examples, function (example) {
      console.log('  > ' + example);
    });

    console.log();
    this.onUsage();
  },

  ask: function (question) {
    var self = this;
    var future = new Future;

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    process.stdout.write(question);

    rl.once('line', function (data) {
      rl.close();
      future.return(data);
    });

    return future.wait();
  },

  confirm: function (msg) {
    var format = /[yYnN]/;
    var question = cli.yellow(msg + ' [yYnN]: ');
    var answer = this.ask(question);

    while (!format.test(answer)) {
      answer = this.ask(question);
    }

    return /[yY]/.test(answer);
  },

  findAppDir: function (filepath) {
    var isAppDir = function (filepath) {
      try {
        return fs.statSync(path.join(filepath, '.meteor', 'packages')).isFile();
      } catch (e) {
        return false;
      }
    };

    var dir = findUpwards(isAppDir, filepath);

    if (!dir) {
      this.logError("Looks like you're not in a Meteor project directory.");
      return false;
    }

    return dir;
  },

  isFile: function (filepath) {
    try {
      return fs.statSync(filepath).isFile();
    } catch (e) {
      return false;
    }
  },

  appPathFor: function (filepath) {
    var appDir = this.findAppDir();

    if (appDir)
      return path.join(appDir, filepath);
    else
      process.exit(1);
  },

  /*
   * Create a directory if it doesn't already exist. Recursively create parent
   * directories if needed. dir is assumed to be a path relative to the root
   * project directory.
   *
   * Implementation inspired by meteor/tools/files.js
   */
  writeDir: function (dir, mode, opts) {
    var p;
    var ps;

    opts = opts || {};

    if (opts.useAppPath === false)
      p = path.resolve(dir);
    else
      p = this.appPathFor(dir);

    ps = path.normalize(p).split(path.sep);

    try {
      if (fs.existsSync(p)) {
        if (fs.statSync(p).isDirectory())
          return true;
        else
          return false;
      }

      var success = this.writeDir(ps.slice(0,-1).join(path.sep), mode, {
        useAppPath: false
      });

      // parent is not a directory.
      if (!success) { return false; }

      fs.mkdirSync(p, mode);

      // double check we exist now
      if (!fs.existsSync(p) ||
          !fs.statSync(p).isDirectory())
        return false;

      this.logSuccess('created ' + p);
      return true;
    } catch (e) {
      this.logError("Error creating directory " + p + ". " + String(e));
      throw e;
    }
  },

  /**
   * Create a new file, or if one already exists, ask the user if they want to
   * overwrite it. Assume the filename is a relative path from the root of the
   * project directory.
   */
  writeFile: function (filename, data, opts) {
    var confirmed;
    var p = this.appPathFor(filename);


    try {
      confirmed = true;

      var parts = path.normalize(filename).split(path.sep);
      var filename = parts.pop();
      var dirpath = parts.join(path.sep);

      this.writeDir(dirpath);

      if (fs.existsSync(p) && fs.statSync(p).isFile())
        confirmed = this.confirm(p + ' already exists. Do you want to overwrite it?');

      if (confirmed) {
        fs.writeFileSync(p, data);
        this.logSuccess('created ' + p);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      this.logError('Error creating file ' + p + '. ' + String(e));
      throw e;
    }
  },

  getLines: function (file) {
    var raw = fs.readFileSync(file, 'utf8');
    var lines = raw.split(/\r*\n\r*/);

    while (lines.length) {
      var line = lines[lines.length - 1];
      if (line.match(/\S/))
        break;
      lines.pop();
    }

    return lines;
  },

  trimLine: function (line) {
    var match = line.match(/^([^#]*)#/);
    if (match)
      line = match[1];
    line = line.replace(/^\s+|\s+$/g, '');
    return line;
  },

  hasPackage: function (name) {
    var self = this;
    var appDir = this.findAppDir();
    var packageLines = this.getLines(path.join(appDir, '.meteor', 'packages'));
    var packages = [];
    _.each(packageLines, function (line) {
      line = self.trimLine(line);
      if (line !== '')
        packages.push(line);
    });

    return ~packages.indexOf(name);
  },

  capitalize: function (input) {
    return input.charAt(0).toUpperCase() + input.slice(1, input.length);
  },

  classCase: function (input) {
    var self = this;
    var re = /_|-|\./;

    if (!input)
      return '';

    return _.map(input.split(re), function (word) {
      return self.capitalize(word);
    }).join('');
  },

  camelCase: function (input) {
    var output = this.classCase(input);
    output = output.charAt(0).toLowerCase() + output.slice(1, output.length);
    return output;
  },

  fileCase: function (input) {
    if (!input)
      return '';

    // first convert to class case
    input = this.classCase(input);

    // then replace capital letters and join the words
    // with an underscore
    var re = /(?=[A-Z])/
    return _.map(input.split(re), function (word) {
      return word.toLowerCase();
    }).join('_');
  }
};

_.extend(Command.prototype, require('./log.js'));

Command.create = function (opts, handler, parent) {
  if (!opts)
    throw new Error('Command.create requires some options!');

  if (!_.isFunction(handler))
    throw new Error('Command.create requires a handler function!');

  var cmd = new Command(opts, handler);
  parent = parent || em; 

  parent.addCommand(cmd);
  return cmd;
};

Command.UsageError = function () {};
