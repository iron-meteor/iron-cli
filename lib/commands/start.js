/*
var Command = em.Command;
var fork = require('child_process').exec;
var path = require('path');
var _ = require('underscore');

Command.create({
  name: 'start',
  usage: 'em start',
  description: 'Start your Meteor application with settings and env variables.'
}, function (args, opts) {
  // source app_root/config/development/env.sh
  // cat settings.json
  // execute meteor, proxying args
  var envPath = path.join(this.findAppDir(), 'config', 'development', 'env.sh');
  var settingsPath = path.join(this.findAppDir(), 'config', 'development', 'settings.json');

  var flagKeys = Object.keys(opts);
  var flags = [];
  for (var i = 0; i < flagKeys.length; i++) {
    if (flagKeys[i] !== '_')
      flags.push('--' + flagKeys[i] + ' ' + opts[flagKeys[i]]);
  }

  var cmd = [
    'source ' + envPath + ';',
    'METEOR_SETTINGS=$(cat ' + settingsPath + ')',
    'meteor',
    args.join(' '),
    flags.join(' ')
  ].join(' ');

  console.log(cmd);
  fork(cmd, function (err, stderr, stdout) {
    console.log('wtf');
    console.log(stdout);
    console.log(stderr);
  });
});
*/
