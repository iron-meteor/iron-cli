var path = require('path');

var MethodGenerator = Generator.create({
  name: 'methods',
  aliases: ['m'],
  usage: 'iron {generate, g}:{methods, m} [--where]',
  description: 'Generate scaffolding for a Method file.',
  examples: [
    'iron g:methods --where "server"'
  ]
}, function (args, opts) {

  var context = {
    where: opts.where
  };

  this.template(
    'methods/methods.js',
    this.pathFromApp(opts.appPathPrefix, 'methods' + '.js'),
    context
  );

});
