var Command = em.Command;

Command.create({
  name: 'help',
  aliases: ['h'],
  usage: 'em help',
  description: 'Get some help.'
}, function (args, opts) {
  em.logUsage();
});
