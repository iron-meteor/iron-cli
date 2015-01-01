var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var cli = require('cli-color');
var Config = require('../config.js');

Generator.create({
  name: 'project',
  usage: 'em {generate, g}:project',
  description: 'Generate a project structure.'
}, function (args, opts) {

  var root = opts.rootDir || '';
  var optionsChanged = false;
  var options = Config.defaults();
  var allowedConfigExtension = ['jade', 'less', 'sass', 'scss', 'stylus', 'styl', 'coffee', 'ts', 'typescript', 'next.js'];
  _.each(['html', 'css', 'js'], function(fileType, i) {
    if (opts[fileType]) {

      if (opts[fileType] === 'false') {
        optionsChanged = true;
        options.data.view[fileType].create = false;
      } else {
        if ( _.contains( allowedConfigExtension, opts[fileType]) ) {
          optionsChanged = true;
          if (opts[fileType] === 'sass')
            options.data.view[fileType].extension = '.scss'
          else if (opts[fileType] === 'typescript')
            options.data.view[fileType].extension = '.ts'
          else if (opts[fileType] === 'stylus')
            options.data.view[fileType].extension = '.styl'
          else
            options.data.view[fileType].extension = '.' + opts[fileType];
        } else {
          em.logError("Invalide file extension for " + options.data.view[fileType].extension.slice(1) + ': ' + opts[fileType]);
          process.exit(1);
        }
      }
    }
    if (opts.ir || opts['iron-router'])
      optionsChanged = true;
  });
  console.log("this: ", root);

  var confirmed = true;
  if (optionsChanged) {
    console.log();
    console.log(cli.white(JSON.stringify(options.data, null, 2)));
    console.log();
    if (opts.ir || opts['iron-router']) {
      console.log(cli.white("Package(s) to install: iron:router"));
      console.log();
    }
    confirmed = opts['confirm'] || this.confirm("Procede with changes?");
  }

  if (confirmed) {
    if (opts.ir || opts['iron-router'])
      this.installPackage('iron:router', root, args, opts);

    this.writeDir(path.join(root, 'public'), null, opts);

    this.writeFile(path.join(root, '.em/config.json'), this.template('.em/config.js', options), opts);

    // both
    this.writeDir(path.join(root, 'both'), null, opts)
    this.writeDir(path.join(root, 'both/router'), null, opts);
    this.writeDir(path.join(root, 'both/collections'), null, opts);
    this.writeDir(path.join(root, 'both/methods'), null, opts);
    if (options.data.view.js.create)
      this.writeFile(path.join(root, 'both/app' + this.getExtFor('js', root)), this.template('both/app.js', { realExtension: this.getExtFor('js', root) }), opts);

    if (options.data.view.js.create)
      this.writeFile(path.join(root, 'both/router/routes' + this.getExtFor('js', root)), this.template('both/router/routes' + this.getExtFor('js', root) ), opts);

    // client
    this.writeDir(path.join(root, 'client'), null, opts);
    this.writeDir(path.join(root, 'client/collections'), null, opts);
    this.writeDir(path.join(root, 'client/controllers'), null, opts);
    this.writeDir(path.join(root, 'client/lib'), null, opts);

    if (options.data.view.js.create)
      this.writeFile(path.join(root, 'client/app' + this.getExtFor('js', root)), this.template('client/app.js', { realExtension: this.getExtFor('js') }), opts);
    if (options.data.view.html.create)
      this.writeFile(path.join(root, 'client/app' + this.getExtFor('html', root)), this.template('client/app.html', { realExtension: this.getExtFor('html') }), opts);
    if (options.data.view.css.create)
      this.writeFile(path.join(root, 'client/app' + this.getExtFor('css', root)), this.template('client/app.css'), opts);

    // client view folders
    this.writeDir(path.join(root, 'client/views'), null, opts);
    this.writeDir(path.join(root, 'client/views/layouts'), null, opts);
    this.writeDir(path.join(root, 'client/views/shared'), null, opts);

    var viewGenerator = em.findGenerator('view');

    // default client views
    viewGenerator.run(['MasterLayout'], {
      dir: 'layouts',
      templates: {
        '.html': 'master_layout'
      },
      stayalive: true,
      rootDir: root
    });
    viewGenerator.run(['Loading'], {dir: 'shared', stayalive: true, rootDir: root});
    viewGenerator.run(['NotFound'], {dir: 'shared', stayalive: true, rootDir: root});

    // server
    this.writeDir(path.join(root, 'server'), null, opts);
    this.writeDir(path.join(root, 'server/lib'), null, opts);
    this.writeDir(path.join(root, 'server/collections'), null, opts);
    this.writeDir(path.join(root, 'server/controllers'), null, opts);
    this.writeDir(path.join(root, 'server/db'), null, opts);
    this.writeDir(path.join(root, 'server/methods'), null, opts);
    this.writeDir(path.join(root, 'server/publish'), null, opts);
    this.writeDir(path.join(root, 'server/views'), null, opts);

    this.writeDir(path.join(root, 'config'), null, opts);
    this.writeDir(path.join(root, 'config/development'), null, opts);
    this.writeFile(path.join(root, 'config/development/env.sh'), null, opts);
    this.writeFile(path.join(root, 'config/development/settings.json'), null, opts);

    this.writeDir(path.join(root, 'scripts'), null, opts);
    this.writeDir(path.join(root, 'packages'), null, opts);
  }


});
