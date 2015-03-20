# iron

A command line scaffolding tool for Meteor applications. It automatically
creates project structure, files and boilerplate code.

## Version
Note: You are looking at a development version. To see what has been released,
click the `branch` dropdown menu and choose the tag for the latest release. For
example, for version 0.2.5 click `branch: master -> Tags -> 0.2.5`.

## Installation
Install the iron command line tool globally so you can use it from any project directory.

```sh
$ npm install -g iron-meteor
```

**This replaces the `em` command line tool.**

You can remove the meteor-em tool like this:

```sh
$ npm uninstall -g meteor-em
```

You can upgrade an existing project either by hande or by using the `migrate`
command like this:

**./my-app**
```sh
$ iron migrate
```

## Coffeescript Support
I need help creating templates for coffeescript, less, scss, jade, etc. Please
open an issue if you'd like to help on one of these!

The reason is that I rewrote the way the command line tool works with different
engines. But in doing so, I ran out of time to add back all the various engine
templates. It's just a matter of adding the corresponding templates in each of
the template folders. For example, if you have template.js, we need to create
template.js.coffee.

## Usage

Use the `help` command to get a list of the top level commands.

```
$ iron help
```

Use the `g` command to see a list of generators.

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

### Run Your Application

```sh
$ iron run 
```

This will automatically load your config/development/env.sh and config/development/settings.json files.

### Run the Application with a Different Environment

```sh
$ iron run --env=staging
```

This will use the config files in `config/staging` instead.

### Debug Your Application 

```sh
$ iron debug
```

### Build Your Application

```sh
$ iron build
```
### Deploy Your Application on Heroku

Iron projects require buildpacks to look for the app in /app/ in addition to the root for deployments to work. Currently there is a patched version of the Horse buildpack available that is compatible with Iron based projects. Use this fork until the patches has been added to the main Horse repo.

```sh
$ heroku config:set BUILDPACK_URL=https://github.com/lirbank/meteor-buildpack-horse.git
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
