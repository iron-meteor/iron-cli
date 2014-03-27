var Command = em.Command;

Command.create({
  name: 'init',
  usage: 'em init',
  description: 'Initialize your project structure.'
}, function (args, opts) {
  var projectGenerator = em.findGenerator('project');

  // for now just run the project generator.
  // in the future, maybe include iron router automatically
  return projectGenerator.run();
});
