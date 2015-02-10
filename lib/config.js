var fs = require('fs');
var path = require('path');

module.exports = new function() {

  this.options = function(root) {
    var configPath;

      if (root)
        configPath = path.join(root, '.iron', 'config.json');
      else
        configPath = path.join(process.cwd(), '.iron', 'config.json');

    if (fs.existsSync(configPath)) {
      var opts = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return opts;
    } else {
      return false;
    }
  }

  this.defaults = function() {
    return {
      data: {
        view: {
          html: {
            create: true,
            extension: '.html'
          },
          css: {
            create: true,
            extension: '.css'
          },
          js: {
            create: true,
            extension: '.js'
          }
        }
      }
    }
  }
}
