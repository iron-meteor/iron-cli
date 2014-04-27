var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');
var extensions = require('../extensions');

Generator.create({
  name: 'project',
  usage: 'em {generate, g}:project',
  description: 'Generate a project structure.'
}, function (args, opts) {
  var self = this;
  var newJsExt = extensions.get.call(self, '.js');

  this.writeDir('public');

  // both
  this.writeDir('both')
  this.writeDir('both/router');
  this.writeDir('both/collections');
  this.writeDir('both/methods');
  this.writeFileWithTemplate('both/app' + newJsExt);
  this.writeFileWithTemplate('both/router/routes' + newJsExt);

  // client
  this.writeDir('client');
  this.writeDir('client/collections');
  this.writeDir('client/controllers');
  this.writeDir('client/lib');
  this.writeFileWithTemplate('client/app' + newJsExt);
  this.writeFileWithTemplate('client/app.html');

  if (this.hasPackage('less'))
    this.writeFile('client/app.less', this.template('client/app.css'));
  else
    this.writeFile('client/app.css', this.template('client/app.css'));

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
});
