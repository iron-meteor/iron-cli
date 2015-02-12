var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var Config = require('../config.js');

Generator.create({
  name: 'template',
  aliases: ['t'],
  usage: 'iron {generate, g}:{template, t} [path/]<name>',
  description: 'Generate scaffolding for a template.',
  examples: [
    'iron g:template todos/todos_item'
  ]
}, function(args, opts) {
  var filename = args[0];

  if (!filename)
    throw new Command.UsageError;

  if (!this.findProjectDirectory())
    throw new MustBeInProjectError;

  var context = {
    name: this.classCase(filename)
  };

  this.template(
    'template/template.html',
    this.pathFromApp('client/templates/', opts.dir, filename + '.html'),
    context
  );

  this.template(
    'template/template.js',
    this.pathFromApp('client/templates/', opts.dir, filename + '.js'),
    context
  );

  this.template(
    'template/template.css',
    this.pathFromApp('client/templates/', opts.dir, filename + '.css'),
    _.extend({}, context, { className: this.cssCase(filename) })
  );
});

/*
function (args, opts) {
  var self = this;
  var name = args[0];
  var root = opts.rootDir || '';
  var dirname = this.fileCase(name);
  var dir = opts.dir || '';
  var dirpath = path.join('app/client/views/' + dir, dirname);

  var templatesForExt = opts.templates || {};

  try {
   var fileExtensions = this.fileExtensions(opts, root);

   _.each(fileExtensions, function (ext) {
     var realExtension = ext.realExtension;
     var filename = dirname + realExtension;
     var tmplName = templatesForExt[ext.dotType] || 'view';
     var filepath = path.join( dirpath, filename );

     if ( realExtension ) {
      var tmplContent = self.template('app/client/views/' + tmplName + ext.dotType, {
        filepath: filepath,
        filename: filename,
        name: self.classCase(name),
        realExtension: realExtension
      });

      self.writeFile(filepath, tmplContent, opts);
     }

   });
  } catch (e) {
    this.logError("Error creating view: " + String(e));
    return 1;
  }
});
*/
