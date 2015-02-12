var Generator = em.Generator;
var path = require('path');

Generator.create({
  name: 'project',
  usage: 'iron {generate, g}:project [name]',
  description: 'Generate a project structure.'
}, function (args, opts) {

  // the app name is either the first argument to the
  // generator or inferred from the current directory.
  // if no appname is provided, we assume we're already
  // in the project directory.
  var appName = args[0] || path.basename(process.cwd());
  var projectDirectory = args[0] || process.cwd();
  var tmplOptions = { app: appName };

  // copy the project template directory to the project directory
  this.copyTemplateDirectory('project', projectDirectory, tmplOptions);

  // create an empty meteor project in the app folder
  this.createEmptyMeteorProject('app', {cwd: projectDirectory});

  // copy the meteor app folder template to our new app
  this.copyTemplateDirectory('app', path.join(projectDirectory, 'app'), tmplOptions); 

  // install the iron router package
  this.installMeteorPackage('iron:router', {cwd: path.join(projectDirectory, 'app')});
});
