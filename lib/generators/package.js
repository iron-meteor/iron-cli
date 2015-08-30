var path = require('path');

Generator.create({
  name: 'package',
  aliases: ['p'],
  usage: 'iron {generate, g}:{package, p} [path/]<name>',
  description: 'Generate scaffolding for a Package.',
  examples: [
    'iron g:package todos:package'
  ]
}, function (args, opts) {

  var pathToTemplate = this.pathFromApp('packages', opts.dir, this.fileCase(opts.resourceName));

  var context = {
    name: this.classCase(opts.resourceName),
    myPath: path.relative(this.pathFromProject(), pathToTemplate),
    className: this.cssCase(opts.resourceName),
  };

  console.log('package', pathToTemplate, context);

  // this.template(
  //   'package/package.js',
  //   this.pathFromApp(opts.appPathPrefix, 'packages', opts.dir, this.fileCase(opts.resourceName) + '.js'),
  //   context
  // );
  //

  // this.template(
  //   'template/template.html',
  //   pathToTemplate + '.html',
  //   context
  // );
  //
  // this.template(
  //   'template/template.js',
  //   pathToTemplate + '.js',
  //   context
  // );
  //
  // if (CurrentConfig.get().template.css) {
  //   this.template(
  //     'template/template.css',
  //     pathToTemplate + '.css',
  //     _.extend({}, context, { className: this.cssCase(opts.resourceName) })
  //   );
  // }

});
