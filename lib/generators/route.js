var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var extensions = require('../extensions');

var RouteGenerator = Generator.create({
  name: 'route',
  aliases: ['r'],
  usage: 'em {generate, g}:{route, r} [path/]<name> [--where] [--dir]',
  description: 'Generate scaffolding for a Route.',
  examples: [
    'em g:route todos/todos_index'
  ]
}, function (args, opts) {
  var self = this;

  try {
    var name = args[0];
    var filename = self.fileCase(name);
    var dir = opts.dir || '';
    var filepath;
    var where = 'both';
    var newExt = extensions.get.call(self, '.js');
    var routesPath = 'both/router/routes' + newExt;

    var begin = /Router\.map\(function\s?\(\)\s?{/;
    var end = /}\);?/;
    if (newExt === '.coffee') {
      begin = /Router.map ->\s?/;
      end = /#\send\smap/;
    }
    var content = self.template('both/router/route' + newExt, {
      name: self.routeCase(name)
    });

    // if routes.js file doesn't exist let's create it
    if (!self.isFile(routesPath))
      self.writeFileWithTemplate(routesPath);

    self.injectContentIntoFile(routesPath, content, begin, end); 

    //XXX change to .generate(name, opts) ?
    opts.stayalive = true;
    self.findGenerator('controller').run([name], opts);
    self.findGenerator('view').run([name], opts);
  } catch (e) {
    self.logError("Error creating route: " + String(e));
    self.logError(e.stack);
    return 1;
  }
});

RouteGenerator.routeCase = function (input) {
  return this.fileCase(input).replace(/_/g, '.');
};
