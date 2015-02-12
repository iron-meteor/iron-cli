var Generator = em.Generator;

var ScaffoldGenerator = Generator.create({
  name: 'scaffold',
  usage: 'iron {generate, g}:{scaffold, s} [path/]<name> [--where]',
  description: 'Generate scaffolding for a resource.',
  examples: [
    'iron g:scaffold todos'
  ]
}, function (args, opts) {
  em.findGenerator('collection').invoke(args, opts);
  em.findGenerator('template').invoke(args, opts);
  em.findGenerator('controller').invoke(args, opts);
  em.findGenerator('route').invoke(args, opts);
  em.findGenerator('publish').invoke(args, opts);
});
