//XXX we need to clean up this extension thing it's a bit messy.
//
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

