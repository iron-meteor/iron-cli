var util = require('util');
var _ = require('underscore');
var Fiber = require('fibers');
var Future = require('fibers/future');
var Table = require('cli-table');

/**
 * The main Command class.
 */

function Command (opts, handler) {
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

module.exports = Command;

/**
 * Returns true if this command matches a name or an alias.
 */
Command.prototype.match = function match(nameOrAlias) {
  var names = [this.name].concat(this.options.aliases || []);
  return ~names.indexOf(nameOrAlias) ? this : false;
};

/**
 * Adds a sub command to this command.
 */
Command.prototype.addCommand = function addCommand(cmd) {
  if (!(cmd instanceof Command))
    throw new Error("addCommand requires a Command instance");
  this._commands.push(cmd);
};

/**
 * Finds a sub command by name.
 */
Command.prototype.findCommand = function findCommand(name) {
  var cmd;
  for (var i = 0, len = this._commands.length; i < len; i++) {
    cmd = this._commands[i];
    if (cmd.match(name))
      return cmd;
  }
};

/**
 * Adds a generator to the generators list for
 * this command.
 */
Command.prototype.addGenerator = function addGenerator(gen) {
  if (!(gen instanceof Generator))
    throw new Error("addGenerator requires a Generator instance");
  this._generators.push(gen);
};

/**
 * Finds a generator by name.
 */
Command.prototype.findGenerator = function findGenerator(name) {
  var res;
  for (var i = 0, len = this._generators.length; i < len; i++) {
    res = this._generators[i];
    if (res.match(name))
      return res;
  }
};

/**
 * Run this command. Process will exit when the command has
 * completed.
 */

Command.prototype.run = function run(args, opts) {
  var self = this;
  args = args || [];
  opts = opts || {};

  var result = this.invoke(args, opts);

  if (result === false)
    process.exit(1);
  else if (typeof result === 'number')
    process.exit(result);
  else
    process.exit(0);
};

/**
 * Invoke a command but only exit the process if an error is thrown.
 * Otherwise just returns the handler result to the caller.
 */
Command.prototype.invoke = function invoke(args, opts) {
  var self = this;
  args = args || [];
  opts = opts || {};

  try {
    return self._handler.call(self, args, opts);
  } catch (e) {
    if (e instanceof Command.UsageError) {
      self.logUsage();
    } else if (e instanceof Command.MustBeInProjectError) {
      self.logError("You must be in an iron project to run this command. Type iron help for iron commands.");
      Iron.logUsage();
    } else {
      throw e;
    }

    process.exit(1);
  }
};

Command.prototype.findSubCommand = function findSubCommand(command) {
  var cmd;
  var parts;
  var firstArg;

  parts = command.split(':');
  command = parts[0];
  return this.findCommand(command);
};

/**
 * Runs a sub command. Throws a usage error if the
 * subcommand isn't found.
 */
Command.prototype.runSubCommand = function runSubCommand(command, args, opts) {
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
      throw e;
    }
  } else {
    throw new Command.UsageError;
  }
};

/**
 * Returns the description for the command.
 */
Command.prototype.description = function description() {
  return this.options.description || 'No description provided.';
};

/**
 * Returns the usage for the command.
 */
Command.prototype.usage = function usage() {
  return this.options.usage || 'No usage provided.';
};

/**
 * Returns an array of examples for the command.
 */
Command.prototype.examples = function examples() {
  return this.options.examples || [];
};

/**
 * Call the onUsage function provided in the options.
 */
Command.prototype.onUsage = function onUsage() {
  var fn = this.options.onUsage;
  fn && fn.call(this);
};

/**
 * Poor man's mixins for various functionality we want on
 * the Command prototype. Look at tools.js to see all of
 * the mixins, which are all stored in the tools
 * directory.
 */
_.extend(Command.prototype, require('./tools'));

Command.create = function (opts, handler, parent) { // command create is what calls addCommand
  if (!opts)
    throw new Error('Command.create requires some options!');

  if (!_.isFunction(handler))
    throw new Error('Command.create requires a handler function!');

  var cmd = new Command(opts, handler);
  parent = parent || Iron;

  parent.addCommand(cmd);
  return cmd;
};

Command.UsageError = function () {};
Command.MustBeInProjectError = function () {};
Command.NoMeteorAppFoundError = function () {};
