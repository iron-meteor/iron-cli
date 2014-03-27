var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

var ScaffoldGenerator = Generator.create({
  name: 'scaffold',
  aliases: ['s'],
  usage: 'em {generate, g}:{scaffold, s} [path/]<name> [--where] [--dir]',
  description: 'Generate scaffolding for a resource.',
  examples: [
    'em g:scaffold todos'
  ]
}, function (args, opts) {
  try {
    var name = args[0];
    // create a collection and method files
    this.logNotice('Generate collection');
    this.findGenerator('collection').run([name], opts);

    this.logNotice('Generate methods');
    this.findGenerator('methods').run([name], opts);

    // make some folders for our new item and then generate some
    var folder = this.fileCase(name);

    // now make a default <name>_index view, publish function and route/controller
    var index = this.fileCase(name) + '_index';

    this.logNotice('Generate default route');
    this.findGenerator('route').run([index], {dir: folder});

    this.logNotice('Generate publish');
    this.findGenerator('publish').run([index], {dir: folder});
  } catch (e) {
    this.logError("Error generating scaffold. " + String(e));
    return 1;
  }
});
