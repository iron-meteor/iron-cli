var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

Generator.create({
  name: 'create',
  aliases: ['cr'],
  usage: 'iron create <name>',
  description: 'Create a boiler plate iron meteor project',
  examples: [
    'iron create myApp'
  ]
}, function (args, opts) {
  var projectName = args[0];

  this.createMeteorProject(projectName);
  this.removeDefaultFiles(projectName);
  var projectGenerator = em.findGenerator('project');

  opts.rootDir = path.join(process.cwd(), projectName);
  return projectGenerator.run(args, opts);
  try {
  } catch (e) {
    this.logError("Error creating project: " + String(e));
    return 1;
  }
});
