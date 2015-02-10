var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

var ScaffoldGenerator = Generator.create({
  name: 'package',
  usage: 'iron {generate, g}:package <name> [--path]',
  description: 'Generate scaffolding for a package.',
  examples: [
    'iron g:package my_package',
    'iron g:package my_package --path ~/somepath/to/meteor_packages'
  ]
}, function (args, opts) {
  try {
    var name = args[0];
    var dirpath;
    var isApp = true;

    if (opts.path) {
      // writeFile will use the absolute path provided instead
      // of automatically finding the root of the app folder.
      isApp = false;
      dirpath = path.resolve(opts.path);
    } else {
      // writeFile will find the packages folder at the root of
      // the app folder
      isApp = true;
      dirpath = 'packages';
    }

    dirpath = path.join(dirpath, name);

    // 1. create the package folder
    this.writeDir(dirpath, { isAppPath: isApp });

    // 2. create a package.js file
    var packageFilepath = path.join(dirpath, 'package.js');
    var content = this.template('package/package.js', {
      name: name,
      summary: opts.summary || ''
    });
    this.writeFile(packageFilepath, content, {isAppPath: isApp});

    // 3. create the main package file
    var mainFilepath = path.join(dirpath, name + '.js');
    content = this.template('package/main_file.js', {
      name: name
    });
    this.writeFile(mainFilepath, content, {isAppPath: isApp});

    // 4. create the test file
    var testFilepath = path.join(dirpath, name + '_tests.js');
    content = this.template('package/test_file.js', {
      name: name
    });
    this.writeFile(testFilepath, content, {isAppPath: isApp});
  } catch (e) {
    this.logError("Error generating package. " + String(e));
    return 1;
  }
});
