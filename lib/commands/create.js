Command.create({
  name: 'create',
  aliases: ['cr'],
  usage: 'iron create <name>',
  description: 'Create a new iron meteor project.',
  examples: [
    'iron create my-app'
  ]
}, function (args, opts) {
  if (args.length < 1)
    throw new Command.UsageError;
  var name = args[0];

  if (this.createDirectory(name)) {
    return Iron.findCommand('init').invoke(args, opts);
  } else {
    return false;
  }
});
