var util = require('util');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var _ = require('underscore');

var Command = em.Command;

var libPathFor = function (/* args */) {
  var args = _.toArray(arguments).join(path.sep);
  return path.join(__dirname, '../lib', args);
};

var Generator = module.exports = function (opts, handler) {
  Command.prototype.constructor.apply(this, arguments);
};

util.inherits(Generator, Command);

_.extend(Generator.prototype, {
  run: function (args, opts) {
    // later on we might want to override this
    return Command.prototype.run.apply(this, arguments);
  }
});

Generator.create = function (opts, handler, parent) {
  if (!opts)
    throw new Error('Generator.create requires some options!');

  if (!_.isFunction(handler))
    throw new Error('Generator.create requires a handler function!');

  var g = new Generator(opts, handler);
  parent = parent || em;
  parent.addGenerator(g);
  return g;
};

_.extend(Generator.prototype, {
  template: function (filepath, data) {
    try {
      var ext = '.ejs';
      var tmplpath = libPathFor('templates', filepath + ext);
      var tmpl = fs.readFileSync(tmplpath, 'utf8');
      return ejs.render(tmpl, data);
    } catch (e) {
      this.logError('Error compiling template at ' + tmplpath + '. ' + String(e));
      //XXX should process exit here or from caller?
      process.exit(1);
    }
  },

  findGenerator: function (name) {
    return em.findGenerator(name);
  },

  writeFileWithTemplate: function (filepath, data) {
    return this.writeFile(filepath, this.template(filepath, data));
  },

  injectContentIntoFile: function (filepath, content, begin, end) {
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
    var parts = re.exec(raw).slice(1);
    parts.splice(3, 0, content);
    fs.writeFileSync(filepath, parts.join(''));
    this.logSuccess('updated ' + filepath);
  }
});
