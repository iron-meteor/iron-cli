var Command = em.Command;
var path = require('path');

// --css=css|scss|less
// --js=js|coffee|next.js
// --html=html|jade
// --skip-template-css=true|false
// --skip-template-js=true|false
// --skip-template-html=true|false
Command.create({
  name: 'init',
  usage: 'iron init',
  description: 'Initialize your project structure.'
}, function (args, opts) {
  // the app name is either the first argument to the
  // generator or inferred from the current directory.
  // if no appname is provided, we assume we're already
  // in the project directory.
  var appName = args[0] || path.basename(process.cwd());
  var projectDirectory = args[0] || process.cwd();

  var config = {
    engines: {
      html: opts.html || 'html',
      js: opts.js || 'js',
      css: opts.css || 'css'
    },

    template: {
      html: !opts['skip-template-html'],
      js: !opts['skip-template-js'],
      css: !opts['skip-template-css']
    }
  };

  var context = {
    app: appName,
    config: config
  };

  // how do we get the initial config class if I haven't
  // written config.json yet? Make a global dynamic variable
  // that gets set by the generator
  // CurrentConfig.get();
  // CurrentConfig.withValue({}, function() {
  // });

  var self = this;

  return CurrentConfig.withValue(config, function () {
    // copy the project template directory to the project directory
    self.copyTemplateDirectory('project', projectDirectory, context);

    // create an empty meteor project in the app folder
    self.createEmptyMeteorProject('app', {cwd: projectDirectory});

    // copy the meteor app folder template to our new app
    self.copyTemplateDirectory('app', path.join(projectDirectory, 'app'), context); 

    // install the iron router package
    self.installMeteorPackage('iron:router', {cwd: path.join(projectDirectory, 'app')});

    return true;
  });
});
