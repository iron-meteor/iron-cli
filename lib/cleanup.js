/*****************************************************************************/
/* Old extension lookup code */
/*****************************************************************************/
var cli = require('cli-color');
  getRealExtensionFor: function (fileType) {
    if (fileType === 'html')
      return this.getAltResourceOrDefault('html', ['jade']).realExtension;
    if (fileType === 'css')
      return this.getAltResourceOrDefault('css', ['stylus', 'less', 'scss']).realExtension;
    if (fileType === 'js')
      return this.getAltResourceOrDefault('js', ['coffeescript', 'typescript']).realExtension;
  },

  /*
   * if no packages for alternative resources exist
   * then return default fileInfo
   * only called when creating .iron/config.json
   */
  getAltResourceOrDefault: function (fileType, alternatives) {
    var fileInfo = {
      fileType: fileType,
      dotType: '.' + fileType,
      realExtension: '.' + fileType
    };

    var num = 1;
    _.each(alternatives, function(type) {
      if (this.hasPackage(type)) {
        fileInfo.fileType = type;
        if (type === 'stylus')
          return fileInfo.realExtension = '.styl';
        if (type === 'coffeescript')
          return fileInfo.realExtension = '.coffee';
        if (type === 'typescript')
          return fileInfo.realExtension = '.ts';
        return fileInfo.realExtension = '.' + type;
      }
    }, this);
    return fileInfo;
  },

  getExtFor: function (fileType, root) {
    var configOpts = Config.options(root);
    if (! _.isEmpty(configOpts) && configOpts.view) {
      if( _.contains(['html', 'css', 'js'], fileType) ) {
        if (configOpts.view[fileType] && configOpts.view[fileType].create && configOpts.view[fileType].extension)
          return configOpts.view[fileType].extension;
        else
          return false;
      }
    }
  },

  fileExtensions: function (opts, root) {
    return [
        { fileType: 'html', dotType: '.html', realExtension: this.getExtFor('html', root) },
        { fileType: 'css', dotType: '.css', realExtension: this.getExtFor('css', root) },
        { fileType: 'js', dotType: '.js', realExtension: this.getExtFor('js', root) }
      ];
  },

/*****************************************************************************/
/* Old Project Generator */
/*****************************************************************************/
  var root = opts.rootDir || '';
  var optionsChanged = false;
  var options = Config.defaults();
  var allowedConfigExtension = ['jade', 'less', 'sass', 'scss', 'stylus', 'styl', 'coffee', 'ts', 'typescript', 'next.js'];

  // writeDir and writeFile will bail out if we're not currently
  // in a project directory unless this option is set.

  // XXX cleanup
  _.each(['html', 'css', 'js'], function(fileType, i) {
    if (opts[fileType]) {

      if (opts[fileType] === 'false') {
        optionsChanged = true;
        options.data.view[fileType].create = false;
      } else {
        if ( _.contains( allowedConfigExtension, opts[fileType]) ) {
          optionsChanged = true;
          if (opts[fileType] === 'sass')
            options.data.view[fileType].extension = '.scss'
          else if (opts[fileType] === 'typescript')
            options.data.view[fileType].extension = '.ts'
          else if (opts[fileType] === 'stylus')
            options.data.view[fileType].extension = '.styl'
          else
            options.data.view[fileType].extension = '.' + opts[fileType];
        } else {
          em.logError("Invalid file extension for " + options.data.view[fileType].extension.slice(1) + ': ' + opts[fileType]);
          process.exit(1);
        }
      }
    }
  });

  // make sure this goes first so the rest of the commands
  // can identify this folder as an iron project
  this.writeFile('.iron/config.json', this.template('.iron/config.js', options), opts);

  this.writeDir('config', null, opts);
  this.writeDir('config', null, opts);
  this.writeDir('config/development', null, opts);
  this.writeFile('config/development/env.sh', null, opts);
  this.writeFile('config/development/settings.json', null, opts);

  this.writeDir('bin', null, opts);

  this.createMeteorProject('app', root);
  this.installPackage('iron:router', root);

  this.writeDir('app/private', null, opts);
  this.writeDir('app/public', null, opts);
  this.writeDir('app/lib', null, opts);
  this.writeDir('app/packages', null, opts);

  this.writeDir('app/client', null, opts);
  this.writeDir('app/client/collections', null, opts);
  this.writeDir('app/client/controllers', null, opts);
  this.writeDir('app/client/lib', null, opts);
  this.writeDir('app/client/views', null, opts);
  this.writeDir('app/client/views/layouts', null, opts);
  this.writeDir('app/client/views/shared', null, opts);

  if (options.data.view.js.create)
    this.writeFile('app/client/app' + this.getExtFor('js', root), this.template('app/client/app.js', { realExtension: this.getExtFor('js') }), opts);
  if (options.data.view.html.create)
    this.writeFile('app/client/app' + this.getExtFor('html', root), this.template('app/client/app.html', { realExtension: this.getExtFor('html') }), opts);
  if (options.data.view.css.create)
    this.writeFile('app/client/app' + this.getExtFor('css', root), this.template('app/client/app.css'), opts);

  this.writeDir('app/both', null, opts);
  this.writeDir('app/both/router', null, opts);
  this.writeDir('app/both/collections', null, opts);
  this.writeDir('app/both/methods', null, opts);

  if (options.data.view.js.create)
    this.writeFile('app/both/app' + this.getExtFor('js', root), this.template('app/both/app.js', { realExtension: this.getExtFor('js', root) }), opts);
  if (options.data.view.js.create)
    this.writeFile('app/both/router/routes' + this.getExtFor('js', root), this.template('app/both/router/routes' + this.getExtFor('js', root) ), opts);

  this.writeDir('app/server', null, opts);
  this.writeDir('app/server/lib', null, opts); 
  this.writeDir('app/server/collections', null, opts);
  this.writeDir('app/server/controllers', null, opts);
  this.writeDir('app/server/db', null, opts);
  this.writeDir('app/server/methods', null, opts);
  this.writeDir('app/server/publish', null, opts);
  this.writeDir('app/server/views', null, opts);

  var viewGenerator = em.findGenerator('view');
  viewGenerator.run(['MasterLayout'], {
    dir: 'layouts',
    templates: {
      '.html': 'master_layout'
    },
    stayalive: true,
    rootDir: root
  });

  viewGenerator.run(['Loading'], {dir: 'shared', stayalive: true, rootDir: root});
  viewGenerator.run(['NotFound'], {dir: 'shared', stayalive: true, rootDir: root});
