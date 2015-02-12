// TODO add back where option
var Generator = em.Generator;
var path = require('path');
var _ = require('underscore');

var CollectionGenerator = Generator.create({
  name: 'collection',
  aliases: ['col'],
  usage: 'iron {generate, g}:{collection, col} <name> [--where]',
  description: 'Generate scaffolding for a Collection.',
  examples: [
    'iron g:collection todos'
  ]
}, function (args, opts) {
  var filename = args[0];

  if (!filename)
    throw new Command.UsageError;

  if (!this.findProjectDirectory())
    throw new MustBeInProjectError;

  var context = {
    name: this.classCase(filename),
    collectionName: this.fileCase(filename),
    where: opts.where
  };

  var pathprefix;
  switch (opts.where) {
    case 'both':
      pathprefix = 'lib';
      break;
    case 'server':
      pathprefix = 'server';
      break;
    case 'client':
      pathprefix = 'client';
      break;
  }

  this.template(
    'collection/collection.js',
    this.pathFromApp(pathprefix, 'collections/', opts.dir, filename + '.js'),
    context
  );
});

/*
  try {
    var self = this;
    var name = args[0];
    var filename = this.fileCase(name);
    var className = this.classCase(name);
    var dir = '';

    var createCollectionFile = function (where, opts) {
      opts = opts || {};
      var relpath = path.join(where, 'collections/' + dir);
      var ext = self.getExtFor('js');
      var filepath = path.join(relpath, filename + ext);

      var tmplOptions = {
        name: className,
        filename: filename,
        filepath: filepath,
        where: self.classCase(where),
        clientOnly: (where === 'client'),
        realExtension: ext
      };

      var contentParts = [];
      contentParts.push(self.template('create_collection.js', tmplOptions));
      contentParts.push(self.template('collection_query_comment.js', tmplOptions));

      if (opts.withAuth) {
        contentParts.push(self.template('server/collections/collection_auth.js', tmplOptions));
      }

      self.writeFile(filepath, contentParts.join('\n'));
    };

    var createCollectionAuthFile = function () {
      var relpath = path.join('server/collections/' + dir);
      var ext = self.getExtFor('js');
      var filepath = path.join(relpath, filename + ext);
      var tmplOptions = {
        name: className,
        filename: filename,
        filepath: filepath,
        realExtension: ext
      };

      var contentParts = [];
      contentParts.push(self.template('collection_query_comment.js', tmplOptions));
      contentParts.push(self.template('server/collections/collection_auth.js', tmplOptions));
      self.writeFile(filepath, contentParts.join('\n'));
    };

    var createQueryFile = function (where) {
      opts = opts || {};
      var relpath = path.join(where, 'collections/' + dir);
      var ext = self.getExtFor('js');
      var filepath = path.join(relpath, filename + ext);

      var tmplOptions = {
        name: className,
        filename: filename,
        filepath: filepath,
        where: self.classCase(where),
        realExtension: ext
      };

      var contentParts = [];
      contentParts.push(self.template('collection_query_comment.js', tmplOptions));
      self.writeFile(filepath, contentParts.join('\n'));
    };

    if (opts.where === 'client') {
      // only create a collection on the client
      createCollectionFile('client');
    } else if (opts.where === 'server') {
      // only create a collection on the server
      createCollectionFile('server', {withAuth: true});
    } else {
      // create collection in both, with a server set of auth rules
      createCollectionFile('both');
      createCollectionAuthFile();
      createQueryFile('client');
    }
  } catch (e) {
    this.logError("Error creating collection. " + String(e));
    return 1;
  }



*/
