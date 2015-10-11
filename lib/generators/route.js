var path = require('path');

var RouteGenerator = Generator.create({
  name: 'route',
  aliases: ['r'],
  usage: 'iron {generate, g}:{route, r} [path/]<name> [--where] [--controller] [--action] [--root]',
  description: 'Generate scaffolding for a Route.',
  examples: [
    'iron g:route todos/todos_index',
    'iron g:route webhooks/stripe --where "server"',
    'iron g:route todos/show_todo --action "show"',
    'iron g:route todos/todo_users --controller "usersController"',

  ]
}, function (args, opts) {
  var routePath = path.join(opts.dir, this.fileCase(opts.resourceName)).replace(/\\/g,'/');
  var routeName = this.camelCase(routePath);

  var context = {
    name: routeName,
    routePath: opts.root ? '/' : routePath,
    controller: opts.controller || this.classCase(opts.resourceName) + 'Controller',
    action: opts.action || 'action',
    // where can only be 'client' or 'server' but not 'both'. since
    // the default --where is 'both' we need to rewrite that to be
    // for the client.
    where: opts.where === 'server' ? 'server' : 'client'
  };

  var destpath = this.rewriteDestinationPathForEngine(this.pathFromApp('lib/routes.js'));
  var content = this.templateContent('route/route.js', context);
  this.injectAtEndOfFile(destpath, '\n' + content);


  var isOriginGen = (opts._ && opts._[0] === 'g:route');
  var config = CurrentConfig.get() || {};
  var configRoute = config.route || {};

  if (configRoute.controller && isOriginGen)
    Iron.findGenerator('controller').invoke(args, opts);

  if (configRoute.template && isOriginGen)
    Iron.findGenerator('template').invoke(args, opts);

});
