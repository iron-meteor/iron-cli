var path = require('path');
var _ = require('underscore');

// --css=css|scss|less
// --js=js|coffee|next.js
// --html=html|jade

// --skip-template-css=true|false
// --skip-template-js=true|false
// --skip-template-html=true|false

// --skip-generator-comments

// --skip-iron-router
// --skip-route-controller
// --skip-route-template

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
  var orbitDirectory = path.join(projectDirectory, 'app', 'client');

  var config = {
    engines: {
      html: opts.html || 'html',
      js: opts.js || 'js',
      css: opts.css || 'css'
    },
    template: {
      html: !_.has(opts, 'skip-template-html'),
      js: !_.has(opts, 'skip-template-js'),
      css: !_.has(opts, 'skip-template-css') && !opts.orbit
    },
    route: {
      controller: !_.has(opts, 'skip-route-controller'),
      template: !_.has(opts, 'skip-route-template')
    },
    generator: {
      comments: !_.has(opts, 'skip-generator-comments')
    }
  };

  var context = {
    app: appName,
    config: config
  };

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
    Iron.findGenerator('controller').invoke(['home'], {cwd: projectDirectory});
    Iron.findGenerator('route').invoke(['home'], {cwd: projectDirectory, root: true});
    Iron.findGenerator('methods').invoke(['methodName'], {cwd: projectDirectory, where: 'both'});
    Iron.findGenerator('methods').invoke(['methodName'], {cwd: projectDirectory, where: 'server'});

    if (!_.has(opts, 'skip-iron-router')) {
      // install the iron router package
      self.installMeteorPackage('iron:router', {cwd: appDirectory});
    }

    if (config.template.css) {
      if (config.engines.css == 'scss')
        self.installMeteorPackage('fourseven:scss', {cwd: appDirectory});

      Iron.findGenerator('stylesheet').invoke(['main'], {cwd: projectDirectory});
    }

    if (config.template.js) {
      if (config.engines.js == 'coffee')
        self.installMeteorPackage('coffeescript', {cwd: appDirectory});
    }

    if (config.template.html) {
      if (config.engines.html == 'jade')
        self.installMeteorPackage('mquandalle:jade', {cwd: appDirectory});
    }

    if (opts.orbit) {
      // copy the orbit directory
      self.copyTemplateDirectory('orbit', orbitDirectory, context);
      // install rainhaven:orbit
      self.installMeteorPackage('scottmcpherson:orbit', {cwd: appDirectory});
    }

    if ('js' in opts && opts['js'].toLowerCase() === 'es6') {
      // install the Babel package for Meteor.
      self.installMeteorPackage('grigio:babel', {cwd: appDirectory});
    }

    return true;
  });
});
