var fs = require('fs');
var path = require('path');
var _ = require('underscore');

Command.create({
  name: 'migrate',
  usage: 'migrate',
  description: 'Migrate to the new iron project structure.'
}, function (args, opts) {
  var self = this;

  if (!this.isDirectory('.em')) {
    this.logError("You can only run this command from the root of an old em project with a .em folder.");
    return false;
  }

  if (!this.confirm("You are about to upgrade this project folder! I would strongly recommended you make a backup of the folder first. Also, this migration only works with JavaScript. If you're using CoffeeScript or Harmony you should upgrade by hand. Are you sure you'd like to continue?"))
    return false;

  if (this.isDirectory('app')) {
    this.logError("There's already an app folder in your project which was unexpected. Temporarily rename it to something like _app so I can copy this directory into a new app folder, please.");
    return false;
  }

  if (this.isDirectory('lib')) {
    this.logError("There's already a lib folder in your project which was unexpected. Temporarily rename it to something like _lib so I can create a new lib directory please.");
    return false;
  }

  // do this first so we bail out before copying folders, if any
  // of the config stuff is wrong
  var initOptions = {
    'skip-iron-router': true
  };

  if (this.isFile('.em/config.json')) {
    var oldConfig = JSON.parse(fs.readFileSync('.em/config.json'));
    initOptions.html = oldConfig.view.html.extension.replace('.', '');
    initOptions.css = oldConfig.view.css.extension.replace('.', '');
    initOptions.js = oldConfig.view.js.extension.replace('.', '');

    if (oldConfig.view.html.create === false)
      initOptions['skip-template-html'] = true;

    if (oldConfig.view.js.create === false)
      initOptions['skip-template-js'] = true;

    if (oldConfig.view.css.create === false)
      initOptions['skip-template-css'] = true; 
  }

  // create the app directory
  this.createDirectory('app');

  // mv the app into the new app directory
  _.each(fs.readdirSync('.'), function (entryPath) {
    if (entryPath === 'app') return;
    fs.renameSync(entryPath, path.join('app', entryPath));
  });

  // okay now that we've moved our app dir into its own folder
  // invoke the init command which won't override the meteor
  // folder if it already exists.

  fs.unlinkSync('app/.em/config.json');
  fs.rmdirSync('app/.em');
  fs.renameSync('app/both', 'app/lib');
  fs.renameSync('app/scripts', './bin');
  fs.renameSync('app/client/views', 'app/client/templates');
  fs.renameSync('app/config', './config');
  fs.renameSync('app/lib/router/routes.js', 'app/lib/routes.js');
  fs.rmdirSync('app/lib/router');

  Iron.findCommand('init').invoke([], initOptions);

  this.logSuccess("Okay you should be good to go.");

  return true;
});
