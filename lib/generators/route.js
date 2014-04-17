var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

var RouteGenerator = Generator.create({
  name: 'route',
  aliases: ['r'],
  usage: 'em {generate, g}:{route, r} [path/]<name> [--where] [--dir]',
  description: 'Generate scaffolding for a Route.',
  examples: [
    'em g:route todos/todos_index'
  ]
}, function (args, opts) {
  try {
    var name = args[0];
    var filename = this.fileCase(name);
    var dir = opts.dir || '';
    var filepath;
    var where = 'both';
    var routesPath = 'both/router/routes.js';

    var begin = /Router\.map\(function\s?\(\)\s?{/;
    var end = /}\);?/;
    var content = this.template('both/router/route.js', {
      name: this.routeCase(name)
    });

    // if routes.js file doesn't exist let's create it
    if (!this.isFile(routesPath))
      this.writeFileWithTemplate(routesPath);

    this.injectContentIntoFile(routesPath, content, begin, end); 

    //XXX change to .generate(name, opts) ?
    opts.stayalive = true;
    this.findGenerator('controller').run([name], opts);
    this.findGenerator('view').run([name], opts);
  } catch (e) {
    this.logError("Error creating route: " + String(e));
    return 1;
  }
});

RouteGenerator.routeCase = function (input) {
  return this.fileCase(input).replace(/_/g, '.');
};
