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

  var optionsChanged = false;
  var options = Config.defaults();
  var allowedConfigExtension = ['jade', 'less', 'sass', 'scss', 'coffee', 'ts', 'typescript', 'next.js'];

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

  var confirmed = true;
  if (optionsChanged) {
    console.log();
    console.log(cli.white(JSON.stringify(options.data, null, 2)));
    console.log();
    if (opts.ir || opts['iron-router']) {
      console.log(cli.white("Package(s) to install: iron:router"));
      console.log();
    }
    confirmed = this.confirm("Procede with changes?");
  }

  if (confirmed) {
    if (opts.ir || opts['iron-router'])
      this.installPackage('iron:router');

    this.writeDir('public');

    this.writeFile('.em/config.json', this.template('.em/config.js', options));

    // both
    this.writeDir('both')
    this.writeDir('both/router');
    this.writeDir('both/collections');
    this.writeDir('both/methods');
    if (options.data.view.js.create)
      this.writeFile('both/app' + this.getExtFor('js'), this.template('both/app.js', { realExtension: this.getExtFor('js') }));

    this.writeFileWithTemplate('both/router/routes.js');

    // client
    this.writeDir('client');
    this.writeDir('client/collections');
    this.writeDir('client/controllers');
    this.writeDir('client/lib');

    if (options.data.view.js.create)
      this.writeFile('client/app' + this.getExtFor('js'), this.template('client/app.js', { realExtension: this.getExtFor('js') }));
    if (options.data.view.html.create)
      this.writeFile('client/app' + this.getExtFor('html'), this.template('client/app.html', { realExtension: this.getExtFor('html') }));
    if (options.data.view.css.create)
      this.writeFile('client/app' + this.getExtFor('css'), this.template('client/app.css'));

    // client view folders
    this.writeDir('client/views');
    this.writeDir('client/views/layouts');
    this.writeDir('client/views/shared');

    var viewGenerator = em.findGenerator('view');

    // default client views
    viewGenerator.run(['MasterLayout'], {
      dir: 'layouts',
      templates: {
        '.html': 'master_layout'
      },
      stayalive: true
    });
    viewGenerator.run(['Loading'], {dir: 'shared', stayalive: true});
    viewGenerator.run(['NotFound'], {dir: 'shared', stayalive: true});

    // server
    this.writeDir('server');
    this.writeDir('server/lib');
    this.writeDir('server/collections');
    this.writeDir('server/controllers');
    this.writeDir('server/db');
    this.writeDir('server/methods');
    this.writeDir('server/publish');
    this.writeDir('server/views');

    this.writeDir('config');
    this.writeDir('config/development');
    this.writeFile('config/development/env.sh');
    this.writeFile('config/development/settings.json');

    this.writeDir('scripts');
    this.writeDir('packages');
  }


});
