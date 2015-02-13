Command.create({
  name: 'build',
  usage: 'iron build [opts]',
  description: 'Build your application into the build folder.',
  examples: [
    'iron build'
  ]
}, function (args, opts) {
  if (!this.findAppDirectory())
    throw new Command.NoMeteorAppFoundError;

  var args = [this.pathFromProject('build')]
  .concat(['--directory'])
  .concat(process.argv.slice(3))

  return this.invokeMeteorCommand('build', args);
});
