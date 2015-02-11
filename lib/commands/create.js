var Command = em.Command;

Command.create({
  name: 'create',
  aliases: ['cr'],
  usage: 'iron create <name>',
  description: 'Create a new iron meteor project',
  examples: [
    'iron create myAppsName'
  ]
}, function (args, opts) {
  if (args.length < 1)
    throw new Command.UsageError;
  var createGenerator = em.findGenerator('create');
  return createGenerator.run(args, opts);
});
