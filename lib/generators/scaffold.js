var ScaffoldGenerator = Generator.create({
  name: 'scaffold',
  usage: 'iron {generate, g}:{scaffold, s} [path/]<name> [--where]',
  description: 'Generate scaffolding for a resource.',
  examples: [
    'iron g:scaffold todos'
  ]
}, function (args, opts) {
  Iron.findGenerator('collection').invoke(args, opts);
  Iron.findGenerator('template').invoke(args, opts);
  Iron.findGenerator('controller').invoke(args, opts);
  Iron.findGenerator('route').invoke(args, opts);
  Iron.findGenerator('publish').invoke(args, opts);
});
