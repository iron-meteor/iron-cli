Command.create({
  name: 'help',
  aliases: ['h'],
  usage: 'iron help',
  description: 'Get some help.'
}, function (args, opts) {
  Iron.logUsage();
});
