var CollectionGenerator = Generator.create({
  name: 'collection',
  aliases: ['col'],
  usage: 'iron {generate, g}:{collection, col} <name> [--where]',
  description: 'Generate scaffolding for a Collection.',
  examples: [
    'iron g:collection todos'
  ]
}, function (args, opts) {
  var context = {
    name: this.classCase(opts.resourceName),
    collectionName: this.fileCase(opts.resourceName),
    where: opts.where
  };

  this.template(
    'collection/collection.js',
    this.pathFromApp(opts.appPathPrefix, 'collections', opts.dir, this.fileCase(opts.resourceName) + '.js'),
    context
  );
});
