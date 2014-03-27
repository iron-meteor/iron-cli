var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

Generator.create({
  name: 'controller',
  aliases: ['c'],
  usage: 'em {generate, g}:{controller, v} [path/]<name> [--where] [--dir]',
  description: 'Generate scaffolding for a RouteController.',
  examples: [
    'em g:c todos_index',
    'em g:controller todos/todos_index --where "server"'
  ]
}, function (args, opts) {
  var self = this;
  var name = args[0];
  var dir = opts.dir || '';
  var filename = this.fileCase(name);

  try {
    var create = function (where) {
      var dirpath = path.join(where, 'controllers/' + dir);
      var filepath = path.join(dirpath, filename + '.js');
      var tmplpath = where === 'server' ? 'controller_server.js' : 'controller.js';
      var tmplContent = self.template(tmplpath, {
        name: self.classCase(name),
        filename: filename,
        filepath: filepath
      });

      self.writeFile(filepath, tmplContent);
    };

    switch (opts.where) {
      case 'client':
        create('client');
        break;
      case 'server':
        create('server');
        break;
      default:
        create('client');
        break;
    };
  } catch (e) {
    this.logError("Error creating controller: " + String(e));
    return 1;
  }
});
