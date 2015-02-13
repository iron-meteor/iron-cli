var cli = require('cli-color');
var readline = require('readline');
var Future = require('fibers/future');

module.exports = {
  ask: function (question) {
    var self = this;
    var future = new Future;

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    process.stdout.write(question);

    rl.once('line', function (data) {
      rl.close();
      future.return(data);
    });

    return future.wait();
  },

  confirm: function (msg) {
    var format = /[yn]/;
    var question = cli.yellow(msg + ' [yn]: ');
    var answer = this.ask(question);

    while (!format.test(answer)) {
      answer = this.ask(question);
    }

    return /[yY]/.test(answer);
  }
}
