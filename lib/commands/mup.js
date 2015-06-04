var path = require('path');
var _ = require('underscore');

var MUP_COMMAND_DESCRIPTION = 'Deploy an app using iron and mup. \n\n' +
    'You can set up a custom iron mup deploy \n' +
    'command and project in .iron/config.json';

Command.create({
  name: 'mup',
  usage: 'iron mup <environment>',
  description: MUP_COMMAND_DESCRIPTION,
  examples: [
    'iron mup dev --init',
    'iron mup dev --setup',
    'iron mup dev (Maps to development. Deploys the project.)',
    'iron mup development',
    'iron mup pro (Maps to production. Deploys the project.)',
    'iron mup production',
    'iron mup <custom-from-config>'
  ]
}, function (args, opts) {

  if (args.length < 1)
    throw new Command.UsageError;

  // Can we get the config options without the callback?
  // For example, var config = CurrentConfig.getConfigFile();
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

  // Can we print the mup stdout with execSync
  // while it's happening, instead of using the spinner?
  var spinHandle = this.logWithSpinner('Deploying with mup');
  var mupCommand;

  if (opts.init) {
    mupCommand = 'mup init';
  } else if (opts.setup) {
    mupCommand = 'mup setup';
  } else {
    mupCommand = 'mup deploy';
  }

  try {
    this.execSync(mupCommand, {cwd: cwd});
  } catch(e) {
    this.logError(e);
  } finally {
    spinHandle.stop();
  }

});