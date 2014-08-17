var fs = require('fs');
var path = require('path');

module.exports = new function() {

  this.options = function() {
    var configPath = path.join(process.cwd(), '.em', 'config.json');
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
