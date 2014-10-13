# em

A command line scaffolding tool for Meteor applications. It automatically
creates project structure, files and boilerplate code. The project structure
mimics that of the EventedMind publishing platform.

## Installation
This branch is under development and can be installed using a beta tag.

```sh
$ npm install -g meteor-em@0.2.1-beta.2
```

## Pre-Reqs

You'll want to have [Iron Router](https://github.com/eventedmind/iron-router)
installed. Also, this command line tool just handles scaffolding for now. `mrt`
and `meteor` are different command line tools. Hopefully, sometime in the near
future we can enhance the `meteor` command line tool to be pluggable!

## Usage

Just type ```em``` from the command line and you'll see the various top level
commands. Then type ```em generate``` or ```em g``` to see a list of generators.

You can initialize your project structure like this:

```sh
$ em init
```

A config file will be generated in your project — `.em/config.json`, and you will
be able to specify what types of files will be created for you when you generate
a view resource. You can also specify alternative file extensions, e.g. .jade, .sass, and .coffee:
```json
{
  "view": {
    "html": {
      "create": true,
      "extension": ".html"
    },
    "css": {
      "create": true,
      "extension": ".css"
    },
    "js": {
      "create": true,
      "extension": ".js"
    }
  }
}
```

### Initializing with options

When running ```em init``` you can also pass in options to save some time.
For example:

```sh
$ em init --ir --css=false --js=coffee
```
This will install [Iron Router](https://github.com/eventedmind/iron-router), set css file creation to false (css files will not be created when generating a new view), and set your preferred js file extensions to .coffee.

Note: ```--css=less``` or ```--css=sass``` will change css file extensions to .less and .scss respectively.



Once your project is initialized and your config.json file is set up, you can begin generating various resources. Here are a few examples:

```sh
$ em g:scaffold todos
$ em g:view todos/todo_item
$ em g:controller webhooks/stripe --where "server"
$ em g:route todos/todo_show
```

## Contributing

This is an early alpha project and any thoughts and contributions are welcome.

## License
MIT
