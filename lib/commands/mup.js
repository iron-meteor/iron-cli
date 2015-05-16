var path = require('path');
var _ = require('underscore');

var MUP_COMMAND_DESCRIPTION = 'Deploy an app using iron and mup. \n\n' +
    'You can set up a custom iron mup deploy \n' +
    'command and project in .iron/config.json';


// For now, we'll just use the deploy
// command. We'll eventually also want
// to proxy additional mup commands.
var MUP_COMMAND = 'mup deploy';


Command.create({
  name: 'mup',
  usage: 'iron mup <environment>',
  description: MUP_COMMAND_DESCRIPTION,
  examples: [
    'iron mup dev (maps to development)',
    'iron mup development',
    'iron mup pro (maps to production)',
    'iron mup production',
    'iron mup <custom-from-config>'
  ]
}, function (args, opts) {

  if (args.length < 1)
    throw new Command.UsageError;

  // Can we get the config options without the callback
  // for example, var config = CurrentConfig.getConfigFile();
  var config = CurrentConfig.withConfigFile(function() {
    return this.CurrentConfig.get();
  });

  var mupConfig;
  var mupConfigKeys;
  var destinationKey = args[0];

  if (config && config.mup) {
    mupConfig = config.mup;
    mupConfigKeys = _.keys(mupConfig);
  }

  if (destinationKey === 'dev')
    destinationKey = 'development';

  if (destinationKey === 'pro')
    destinationKey = 'production';

  if (!_.contains(mupConfigKeys, destinationKey))
    throw new Command.UsageError;

  var destination = mupConfig[destinationKey];
  var cwd = path.join(this.pathFromProject(), destination);
  var spinHandle = this.logWithSpinner('Deploying with mup');

  try {
    this.execSync(MUP_COMMAND, {cwd: cwd});
  } finally {
    spinHandle.stop();
  }

});