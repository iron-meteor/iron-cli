var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var extensions = require('../extensions');

Generator.create({
  name: 'publish',
  aliases: ['p'],
  usage: 'em {generate, g}:{publish, p} [dir/]<name> [--dir]',
  description: 'Generate scaffolding for a Publish function.',
  examples: [
    'em g:publish todos/todos_index'
  ]
}, function (args, opts) {
  var self = this;

  try {
    var name = args[0];
    var filename = this.fileCase(name);
    var className = this.classCase(name);
    var dir = opts.dir || '';
    var filepath;
    var relpath = path.join('server', 'publish/' + dir);
    var newExt = extensions.get.call(self, '.js');

    filepath = path.join(relpath, filename + newExt);

    this.writeFile(filepath, this.template('publish' + newExt, {
      name: className,
      filename: filename,
      filepath: filepath
    }));
  } catch (e) {
    this.logError("Error creating publish: " + String(e));
    return 1;
  }
});
