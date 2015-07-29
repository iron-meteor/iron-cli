var path = require('path');

var MethodGenerator = Generator.create({
  name: 'methods',
  aliases: ['m'],
  usage: 'iron {generate, g}:{methods, m} name [--where]',
  description: 'Generate scaffolding for a Method.',
  examples: [
    'iron g:methods todos --where "server"'
  ]
}, function (args, opts) {

  var context = {
    name: path.join(opts.appPathPrefix, this.fileCase(opts.resourceName)),
    where: opts.where
  };

  // todo: logic to either create a file or append a method

  this.template(
    'methods/methods.js',
    this.pathFromApp(opts.appPathPrefix, 'methods' + '.js'),
    context
  );

});
