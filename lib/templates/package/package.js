Package.describe({
  name: "<%= name %>",
  summary: "What this does",
  version: "1.0.0",
  git: "https://github.com/something/something.git",
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');

  api.use('underscore', 'server');
  api.use('iron:router@1.0.0');

  api.imply('templating')

  api.addFiles('email.js', 'server');

  api.export('Email', 'server');
});

Package.onTest(function (api) {
  api.use('<%= name %>');
  api.use('tinytest@1.0.0');
  api.addFiles('email_tests.js', 'server');
});

/* This lets you use npm packages in your package*/
Npm.depends({
  simplesmtp: "0.3.10",
  "stream-buffers": "0.2.5"
});
