var path = require('path');
var _ = require('underscore');

Generator.create({
  name: 'publish',
  aliases: ['p'],
  usage: 'iron {generate, g}:{publish, p} <name>',
  description: 'Generate scaffolding for a publish function.',
  examples: [
    'iron g:publish todos'
  ]
}, function (args, opts) {

  var context = {
    name: opts.resourceName,
    collection: this.classCase(opts.resourceName)
  };

  var destpath = this.rewriteDestinationPathForEngine(this.pathFromApp('server/publish.js'));
  var content = this.templateContent('publish/publish.js', context);
  this.injectAtEndOfFile(destpath, '\n' + content);
});
