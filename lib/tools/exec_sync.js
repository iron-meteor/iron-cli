var Future = require('fibers/future');
var exec = require('child_process').exec;

module.exports.execSync = function execSync(command, opts) {
  var future = new Future;

  exec(command, function(err, stdout, stderr) {
    if (err)
      future.throw(err);
    else {
      process.stderr.write(stderr);
      process.stdout.write(stdout);
      future.return(true);
    }
  });

  return future.wait();
};
