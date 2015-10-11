var util = require('util');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var _ = require('underscore');

var Generator = module.exports = function Generator (opts, handler) {
  Command.prototype.constructor.apply(this, arguments);
};

util.inherits(Generator, Command);

function inside(dir, func) {
  var cur = process.cwd();
  var ret;

  dir = dir || '.';

  try {
    process.chdir(dir);
    ret = func();
  } finally {
    process.chdir(cur);
  }

  return ret;
}

_.extend(Generator.prototype, {
  invoke: function invoke(args, opts) {
    var self = this;

    var newArgs = args.slice();
    opts.resourceName = newArgs[0];

    if (!opts.resourceName) {
      this.logError("Oops, you're going to need to specify a resource name like 'todos'.");
      this.logError("Here's some help for this command:");
      throw new Command.UsageError;
    }

    // temporarily change into the directory specified in opts.cwd
    inside(opts.cwd, function () {
      if (!self.findProjectDirectory())
        throw new Command.MustBeInProjectError;

      //fix bug in win32
      var parts = opts.resourceName.replace(/\\/g,'/').split('/');

      // pull the path part out of the <name> and put it in
      // the "dir" option.
      if (parts.length > 1) {
        opts.resourceName = parts.pop();
        newArgs[0] = opts.resourceName;
        opts.dir = _.map(parts, function(part) {
          return self.fileCase(part);
        }).join(path.sep);
      } else {
        opts.dir = '';
      }

      // make sure the 'where' opt is set to something,
      // 'both' by default
      opts.where = opts.where || 'both';

      if (!_.contains(['both', 'client', 'server'], opts.where)) {
        self.logError("--where must be 'both', 'client' or 'server'");
        throw new Command.UsageError;
      }

      // set the appPathPrefix depending on the 'where' options
      // --where=both => app/lib
      // --where=server => app/server
      // --where=client => app/client
      switch (opts.where) {
        case 'both':
          opts.appPathPrefix = 'lib';
          break;
        case 'server':
          opts.appPathPrefix = 'server';
          break;
        case 'client':
          opts.appPathPrefix = 'client';
          break;
        default:
          opts.appPathPrefix = '';
      }

      CurrentConfig.withConfigFile(function () {
        Command.prototype.invoke.call(self, newArgs, opts);
      });
    });
  }
});

Generator.create = function (opts, handler, parent) {
  if (!opts)
    throw new Error('Generator.create requires some options!');

  if (!_.isFunction(handler))
    throw new Error('Generator.create requires a handler function!');

  var g = new Generator(opts, handler);
  parent = parent || Iron;
  parent.addGenerator(g);
  return g;
};
