// var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var MUP_COMMAND_DESCRIPTION = 'Deploy an app using iron and mup. \n\n' +
    'You can set up a custom iron mup deploy \n' +
    'command and project in .iron/config.json';
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

  if (!mupConfigKeys.length || !_.contains(mupConfigKeys, destinationKey))
    throw new Command.UsageError;

  var destination = mupConfig[destinationKey];
  var cwd = path.join(this.pathFromProject(), destination);

  this.execSync(MUP_COMMAND, {cwd: cwd});
});