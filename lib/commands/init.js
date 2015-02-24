var path = require('path');
var _ = require('underscore');

// --css=css|scss|less
// --js=js|coffee|next.js
// --html=html|jade
// --skip-template-css=true|false
// --skip-template-js=true|false
// --skip-template-html=true|false
// --skip-iron-router
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
      html: !_.has(opts, 'skip-template-html'),
      js: !_.has(opts, 'skip-template-js'),
      css: !_.has(opts, 'skip-template-css')
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

    var appDirectory = path.join(projectDirectory, 'app');

    // copy the meteor app folder template to our new app
    self.copyTemplateDirectory('app', appDirectory, context);

    // invoke the right generators for some default files
    Iron.findGenerator('template').invoke(['home'], {cwd: projectDirectory});

    if (config.template.css)
      Iron.findGenerator('stylesheet').invoke(['main'], {cwd: projectDirectory});

    if (!_.has(opts, 'skip-iron-router')) {
      // install the iron router package
      self.installMeteorPackage('iron:router', {cwd: appDirectory});
    }

    return true;
  });
});
