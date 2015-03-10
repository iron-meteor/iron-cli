var path = require('path');

var RouteGenerator = Generator.create({
  name: 'route',
  aliases: ['r'],
  usage: 'iron {generate, g}:{route, r} [path/]<name> [--where] [--action]',
  description: 'Generate scaffolding for a Route.',
  examples: [
    'iron g:route todos/todos_index'
  ]
}, function (args, opts) {
  var routePath = path.join(opts.dir, this.fileCase(opts.resourceName));
  var routeName = this.camelCase(routePath);

  var context = {
    name: routeName,
    routePath: routePath,
    controller: this.classCase(opts.resourceName) + 'Controller',
    action: opts.action || 'action',
    // where can only be 'client' or 'server' but not 'both'. since
    // the default --where is 'both' we need to rewrite that to be
    // for the client.
    where: opts.where === 'server' ? 'server' : 'client'
  };

  var destpath = this.pathFromApp('lib/routes.js');
  var content = this.templateContent('route/route.js', context);
  this.injectAtEndOfFile(destpath, '\n' + content);


  var isOriginGen = (opts._[0] === 'g:route');
  var config = CurrentConfig.get() || {};
  var configRoute = config.route || {};

  if (configRoute.controller && isOriginGen)
    Iron.findGenerator('controller').invoke(args, opts);

  if (configRoute.template && isOriginGen)
    Iron.findGenerator('template').invoke(args, opts);

});
