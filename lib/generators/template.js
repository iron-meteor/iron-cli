var Generator = em.Generator;
var _ = require('underscore');

Generator.create({
  name: 'template',
  aliases: ['t'],
  usage: 'iron {generate, g}:{template, t} [path/]<name>',
  description: 'Generate scaffolding for a template.',
  examples: [
    'iron g:template todos/todos_item'
  ]
}, function(args, opts) {
  var context = {
    name: this.classCase(opts.resourceName)
  };

  var pathToTemplate = this.pathFromApp(
    'client/templates',
    opts.dir,
    this.fileCase(opts.resourceName),
    this.fileCase(opts.resourceName)
  );

  this.template(
    'template/template.html',
    pathToTemplate + '.html',
    context
  );

  this.template(
    'template/template.js',
    pathToTemplate + '.js',
    context
  );

  this.template(
    'template/template.css',
    pathToTemplate + '.css',
    _.extend({}, context, { className: this.cssCase(opts.resourceName) })
  );
});
