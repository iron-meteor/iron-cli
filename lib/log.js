var cli = require('cli-color');

module.exports = {
  logSuccess: function () {
    console.log(cli.green.apply(this, arguments));
  },

  logWarn: function () {
    console.log(cli.yellow.apply(this, arguments));
  },

  logNotice: function () {
    console.log(cli.blue.apply(this, arguments));
  },

  logError: function () {
    console.error(cli.red.bold.apply(this, arguments));
  }
};
