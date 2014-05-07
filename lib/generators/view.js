var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var extensions = require('../extensions');

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

  try {
    _.each(['.html', '.js', '.css'], function (ext) {
      var newExt = extensions.get.call(self, ext);
      var filename = dirname + newExt;
      var tmplName = templatesForExt[ext] || 'view';

      filepath = path.join(dirpath, filename);

      var tmplContent = self.template('client/views/' + tmplName + newExt, {
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
