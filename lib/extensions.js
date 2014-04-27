var _ = require('underscore');

var extensions = {
  '.css': function (self) {
    // the first package it finds it will choose as default
    var self = this;
    var possibleProcessorsPackages = {
      'stylus-latest': {
        extension: '.styl'
      },
      'less': {
        extension: '.less'
      }
    };
    var processor = _.find(possibleProcessorsPackages, function (val, key) {
      return self.hasPackage(key);
    });
    
    return processor && processor.extension || '.css';
  },
  '.js': function () {
    var self = this;
    var possibleCompilersPackages = {
      'coffeescript': {
        extension: '.coffee'
      } 
    };
    var compiler = _.find(possibleCompilersPackages, function (val, key) {
      return self.hasPackage(key);
    });

    return compiler && compiler.extension || '.js';
  }
};

exports.get = function (ext) {
  var getExtension = extensions[ext];
  return getExtension && getExtension.call(this) || ext;
};
