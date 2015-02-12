var Generator = em.Generator;

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

  this.template(
    'template/template.html',
    this.pathFromApp('client/templates/', opts.dir, this.fileCase(opts.resourceName) + '.html'),
    context
  );

  this.template(
    'template/template.js',
    this.pathFromApp('client/templates/', opts.dir, this.fileCase(opts.resourceName) + '.js'),
    context
  );

  this.template(
    'template/template.css',
    this.pathFromApp('client/templates/', opts.dir, this.fileCase(opts.resourceName) + '.css'),
    _.extend({}, context, { className: this.cssCase(opts.resourceName) })
  );
});
