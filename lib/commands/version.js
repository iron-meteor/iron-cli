Command.create({
  name: 'version',
  aliases: ['v'],
  usage: 'iron version',
  description: 'Return version number of Iron command line tool.',
  examples: [
    'iron v',
    'iron version'
  ]
}, function (args, opts) {
  if (args.length >= 1)
    throw new Command.UsageError;
  var name = args[0];
  var pjson = require('../../package.json');
  console.log(pjson.version);

  return true;
});
