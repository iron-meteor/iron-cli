var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

Generator.create({
  name: 'controller',
  aliases: ['c'],
  usage: 'iron {generate, g}:{controller, v} [path/]<name> [--where]',
  description: 'Generate scaffolding for a RouteController.',
  examples: [
    'iron g:controller todos/todos_index --where "server"'
  ]
}, function (args, opts) {
});

/*
   var self = this;
  var name = args[0];
  var dir = opts.dir || '';
  var filename = this.fileCase(name);
  var ext = this.getExtFor('js');

  try {
    var create = function (where) {
      var dirpath = path.join('app', where, 'controllers/' + dir);
      var filepath = path.join(dirpath, filename + ext);
      var tmplpath = where === 'server' ? 'app/controller_server.js' : 'app/controller.js';
      var tmplContent = self.template(tmplpath, {
        name: self.classCase(name),
        filename: filename,
        filepath: filepath,
        realExtension: ext
      });

      self.writeFile(filepath, tmplContent, opts);
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

*/
