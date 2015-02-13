# iron

A command line scaffolding tool for Meteor applications. It automatically
creates project structure, files and boilerplate code.

## Installation
Install the iron command line tool globally so you can use it from any project directory.

```sh
$ npm install -g iron-meteor
```

## Usage

Use the help command to get a list of the top level commands:

```
$ iron help
```

To see a list of generators.

```
$ iron g
```

## Commands

### Create an Application
```sh
$ iron create my-app
```

The application will have the following directory structure:

```sh
my-app/
 .iron/
   config.json
 bin/
 build/
 config/
   development/
     env.sh
     settings.json
 app/
   client/
     collections/
     lib/
     stylesheets/
     templates/
     head.html
   lib/
     collections/
     controllers/
     methods.js
     routes.js
   packages/
   private/
   public/
   server/
     collections/
     controllers/
     lib/
     methods.js
     publish.js
     bootstrap.js
```

### Run your Application

```sh
$ iron run 
```

This will automatically load your config/<env>/env.sh and settings.json file.

### Run the Application with a Different Environment

```sh
$ iron run --env staging
```

This will use the config files in `config/staging` instead.

### Build Your Application

```sh
$ iron build
```

This will build your application and put the resulting bundle into the project's
build folder.

### Generators
```sh
$ iron g:scaffold todos
$ iron g:template todos/todo_item
$ iron g:controller webhooks/stripe --where "server"
$ iron g:route todos/show_todo
$ iron g:collection todos
$ iron g:publish todos
$ iron g:stylesheet main
```

### Meteor Commands
Meteor commands will automatically be proxied to the meteor command line tool.

## Contributing
Contributions and ideas are welcome.

## Tests

To run tests
```sh
npm test
```

## License
MIT

## TODOS
- Add engine templates for coffee, less, scss, jade, etc.

