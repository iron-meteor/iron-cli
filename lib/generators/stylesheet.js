Generator.create({
  name: 'stylesheet',
  usage: 'iron {generate, g}:stylesheet [path/]<name>',
  description: 'Generate a stylesheet',
  examples: [
    'iron g:stylesheet todos/todos_item'
  ]
}, function(args, opts) {
  var destpath = this.pathFromApp(
    'client/stylesheets',
    opts.dir,
    this.fileCase(opts.resourceName) + '.css'
  );

  var context = {
    name: this.cssCase(opts.resourceName),
  };

  this.template(
    'stylesheet/stylesheet.css',
    destpath,
    context
  );
});
