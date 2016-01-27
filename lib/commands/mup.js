var path = require('path');
var fs = require('fs');
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
    'iron mup prod (Maps to production. Deploys the project.)',
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
  var mupVersion = 'mup';

  if (config && config.mup) {
    mupConfig = config.mup;
    mupConfigKeys = _.keys(mupConfig);
    if (mupConfig.version) {
      mupVersion = mupConfig.version;
    }
  }

  if (destinationKey === 'dev')
    destinationKey = 'development';

  if (destinationKey === 'prod')
    destinationKey = 'production';

  // Let's not require any settings in the config file
  // If someone is coming from an older version of the CLI
  // they wont have those defaults set anyway
  // if (!_.contains(mupConfigKeys, destinationKey))
  //   throw new Command.UsageError;



  // Default to config directory
  var destination = mupConfig && mupConfig[destinationKey] || 'config/' + destinationKey;
  var cwd = path.join(this.pathFromProject(), destination);

  var mupCommand;

  if (opts.init) {
    if (this.isFile(destination + '/mup.json')) {
      this.logError("MUP already initialized.");
      return false;
    }
    if (this.isFile(destination + '/settings.json')) {
      if (!this.confirm("This will temporarily back up your settings.json file, and replace it after MUP is initialized. Continue?")) {
        return false;
      } else {
        fs.renameSync(destination + '/settings.json', destination + '/settings.bak');
      }
    }
    mupCommand = mupVersion + ' init';
  } else if (opts.setup) {
    mupCommand = mupVersion + ' setup';
  } else if (opts.reconfig) {
    mupCommand = mupVersion + ' reconfig';
  } else {
    mupCommand = mupVersion + ' deploy';
  }

  // Can we print the mup stdout with execSync
  // while it's happening, instead of using the spinner?
  var spinHandle = this.logWithSpinner('Running ' + mupCommand);

  try {
    this.execSync(mupCommand, {cwd: cwd});
  } catch(e) {
    this.logError(e);
  } finally {
    spinHandle.stop();
    if (opts.init) {
      var mupJson = fs.readFileSync(destination + '/mup.json', 'utf8');
      mupJson = mupJson.replace('"enableUploadProgressBar": true', '"enableUploadProgressBar": false');
      fs.writeFileSync(destination + '/mup.json', mupJson);

      if (this.isFile(destination + '/settings.bak')) {
        fs.unlinkSync(destination + '/settings.json');
        fs.renameSync(destination + '/settings.bak', destination + '/settings.json');
      }
    }
  }

});
