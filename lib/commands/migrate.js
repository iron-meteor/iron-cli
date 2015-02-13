var fs = require('fs');
var path = require

Command.create({
  name: 'migrate',
  usage: 'migrate',
  description: 'Migrate from to the new iron project structure'
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
  var initOptions = {};
  if (this.isFile('.em/config.json')) {
    var oldConfig = JSON.parse(fs.readFileSync('.em/config.json'));
    initOptions.html = oldConfig.view.html.extension.replace('.', '');
    initOptions.css = oldConfig.view.css.extension.replace('.', '');
    initOptions.js = oldConfig.view.js.extension.replace('.', '');

    initOptions['skip-template-html'] = !oldConfig.view.html.create;
    initOptions['skip-template-js'] = !oldConfig.view.js.create;
    initOptions['skip-template-css'] = !oldConfig.view.css.create;
  }

  // mv the app into the new app directory
  this.createDirectory('app');
  _.each(this.directoryTree('.'), function(entryPath) {
    if (entry === 'app') return;
    fs.rename(entryPath, path.join('app', entryPath));
  });

  // okay now that we've moved our app dir into its own folder
  // invoke the init command which won't override the meteor
  // folder if it already exists.
  this.findCommand('init').invoke([], initOptions);

  fs.rmdirSync('app/.em');
  fs.rename('app/both', 'app/lib');
  fs.rename('app/scripts', './bin');
  fs.rename('app/client/views', 'app/client/templates');
  fs.rename('app/config', './config');
  fs.rename('app/lib/router/routes.js', 'app/lib/routes.js');
});

  // mkdir .iron <done>
  // template .iron/config.json <done>
  // rm app/.em <done>
  // rename app/both app/lib (what if lib exists?) <done>
  // rename app/scripts ./bin or create bin from scratch <done>
  // rename app/client/views app/client/templates <done>
  // rename app/config ./config or create config from scratch <done>
  // rename app/both/router/routes.js lib/routes.js or create routes.js from
// <done>
