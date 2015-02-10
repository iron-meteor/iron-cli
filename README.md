# iron

A command line scaffolding tool for Meteor applications. It automatically
creates project structure, files and boilerplate code. The project structure
mimics that of the EventedMind publishing platform.

## Installation
Install the iron command line tool globally so you can use it from any project directory.

```sh
$ npm install -g meteor-iron
```

## Pre-Reqs

You'll want to have [Iron Router](https://github.com/eventedmind/iron-router)
installed. Also, this command line tool just handles scaffolding for now. `mrt`
and `meteor` are different command line tools. Hopefully, sometime in the near
future we can enhance the `meteor` command line tool to be pluggable!

## Usage

Just type ```iron``` from the command line and you'll see the various top level
commands. Then type ```iron generate``` or ```iron g``` to see a list of generators.

You can initialize your project structure like this:

```sh
$ iron init
```

A config file will be generated in your project — `.iron/config.json`, and you will
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

When running ```iron init``` you can also pass in options to save some time.
For example:

```sh
$ iron init --ir --css=false --js=coffee
```
This will install [Iron Router](https://github.com/eventedmind/iron-router), set css file creation to false (css files will not be created when generating a new view), and set your preferred js file extensions to .coffee.

Note: ```--css=less``` or ```--css=sass``` will change css file extensions to .less and .scss respectively.



Once your project is initialized and your config.json file is set up, you can begin generating various resources. Here are a few examples:

```sh
$ iron g:scaffold todos
$ iron g:view todos/todo_item
$ iron g:controller webhooks/stripe --where "server"
$ iron g:route todos/todo_show
```

## Contributing

This is an early alpha project and any thoughts and contributions are welcome.

## Tests

To run tests
```sh
npm test
```

## License
MIT
