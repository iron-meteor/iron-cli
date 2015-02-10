var Command = em.Command;

Command.create({
  name: 'help',
  aliases: ['h'],
  usage: 'iron help',
  description: 'Get some help.'
}, function (args, opts) {
  em.logUsage();
});
