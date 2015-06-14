Generator.create({
  name: 'stylesheet',
  usage: 'iron {generate, g}:stylesheet [path/]<name>',
  description: 'Generate a stylesheet',
  examples: [
    'iron g:stylesheet todos/todos_item'
  ]
}, function(args, opts) {
  var pathFromApp = this.pathFromApp(
    'client/stylesheets',
    opts.dir,
    this.fileCase(opts.resourceName)
  );

  var context = {
    name: this.cssCase(opts.resourceName),
  };

  this.template(
    'stylesheet/stylesheet.css',
    pathFromApp + '.css',
    context
  );
});

// use scss index file
// see: https://github.com/fourseven/meteor-scss/#controlling-load-order-since-200-beta_3
if (CurrentConfig.get() && CurrentConfig.get().engines.css == 'scss') {
  var destpath = this.pathFromApp('scss.json');
  var content = '{\n\t"useIndex" : true,\n\t"indexFilePath" : "client/stylesheets/main.scss"\n}'
  this.createFile(destpath, content);
}
