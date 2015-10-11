var path = require('path');
var _ = require('underscore');

Generator.create({
  name: 'package',
  aliases: ['p'],
  usage: 'iron {generate, g}:{package, p} [path/]<name>',
  description: 'Generate scaffolding for a Package.',
  examples: [
    'iron g:package todos:package'
  ]
}, function (args, opts) {

  var file = this.cssCase(opts.resourceName);

  var pathToTemplate = this.pathFromApp('packages', opts.dir, file);

  var pathFromApp = this.pathFromApp('packages', opts.dir, file, 'package.js');

  var context = {
    name: opts.resourceName,
    className: this.classCase(opts.resourceName),
    myPath: path.relative(this.pathFromProject(), pathToTemplate),
    fileName: file
  };

  this.template(
    'package/package.js',
    pathFromApp,
    context
  );

  var that = this;
  _.each(['lib', 'client', 'server', 'test'], function(folder) {
    var packageFile = pathToTemplate + '/' + folder + '/' + file + '.js';
    that.template(
      'package/' + folder + '/package.js',
      packageFile,
      context
    );
  });

});
