var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var Config = require('../config.js');

Generator.create({
  name: 'view',
  aliases: ['v'],
  usage: 'em {generate, g}:{view, v} [path/]<name> [--where] [--dir]',
  description: 'Generate scaffolding for a View.',
  examples: [
    'em g:view todos/todos_item',
    'em g:v todos_item'
  ]
}, function (args, opts) {
  var self = this;
  var name = args[0];
  var dirname = this.fileCase(name);
  var dir = opts.dir || '';
  var dirpath = path.join('client/views/' + dir, dirname);
  var templatesForExt = opts.templates || {};

  if (! this.isConfigFile())
    this.writeFile('.em/config.json', this.template('.em/config.js', Config.defaults()) );

  try {
   var fileExtensions = this.fileExtensions(opts);
   console.log("fileExtensions: ", fileExtensions);

   _.each(fileExtensions, function (ext) {
     var realExtension = ext.realExtension;
     var filename = dirname + realExtension;
     var tmplName = templatesForExt[ext.dotType] || 'view';
     var filepath = path.join( dirpath, filename );

     if ( realExtension ) {
      var tmplContent = self.template('client/views/' + tmplName + ext.dotType, {
        filepath: filepath,
        filename: filename,
        name: self.classCase(name),
        realExtension: realExtension
      });

      self.writeFile(filepath, tmplContent);
     }

   });
  } catch (e) {
    this.logError("Error creating view: " + String(e));
    return 1;
  }
});
