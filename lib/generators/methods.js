var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

Generator.create({
  name: 'methods',
  aliases: ['m'],
  usage: 'em {generate, g}:{methods, m} <name> [--where]',
  description: 'Generate scaffolding for Meteor methods.',
  examples: [
    'em g:methods todos'
  ]
}, function (args, opts) {
  var self = this;
  var name = args[0];
  var filename = this.fileCase(name);
  var className = this.classCase(name);
  var dir = '';
  var filepath;

  try {
    var create = function (where) {
      var relpath = path.join(where, 'methods/' + dir);
      filepath = path.join(relpath, filename + '.js');
      self.writeFile(filepath, self.template('methods.js', {
        name: className,
        filename: filename,
        filepath: filepath,
        where: self.classCase(where)
      }));
    };

    switch (opts.where) {
      case 'client':
        create('client');
        break;
      case 'server':
        create('server');
        break;
      case 'both':
        create('both');
        break;
      default:
        _.each(['both', 'client', 'server'], create);
        break;
    }
  } catch (e) {
    this.logError("Error creating methods: " + String(e));
    return 1;
  }
});
