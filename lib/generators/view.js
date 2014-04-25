var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

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
  
  var alternateExtensions = {
    '.css': function () {
      // the first package it finds it will choose as default
      var possibleProcessorsPackages = {
        'stylus-latest': {
          extension: '.styl'
        },
        'less': {
          extension: '.less'
        }
      };
      var processor = _.find(possibleProcessorsPackages, function (val, key) {
        return self.hasPackage(key);
      });
      
      return processor && processor.extension || '.css';
    }
  };

  var templatesForExt = opts.templates || {};

  try {
    _.each(['.html', '.js', '.css'], function (ext) {
      var getExtension = alternateExtensions[ext];
      var newExt = getExtension ? getExtension() : ext;
      var filename = dirname + newExt;
      var tmplName = templatesForExt[ext] || 'view';

      filepath = path.join(dirpath, filename);

      var tmplContent = self.template('client/views/' + tmplName + ext, {
        filepath: filepath,
        filename: filename,
        name: self.classCase(name)
      });

      self.writeFile(filepath, tmplContent);
    });
  } catch (e) {
    this.logError("Error creating view: " + String(e));
    return 1;
  }
});
