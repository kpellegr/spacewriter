# spacewriter
Game to practice writing

This a simple game written in Javascript (using the Phaser library) to help my son practice his writing.

It is a combination of asteroids and Google's 2016 halloween game. The goal is to destroy asteroids by writing the words that appear on them.


## Build, Install & Run

This project requires `bower` as a dependency manager. Make sure you have it installed.

Then pull this repo and navigate to the root directory. Run the `bower install` command. This will pull in all the dependencies specified in `bower.json`. To run the project you'll have to host a simple HTTP server inside the root directory.

This can be accomplished in multiple ways (node, ruby, python, ...). With python it can be achieved in the following manner:

	python -m SimpleHTTPServer 8000

This will start a web server available at `localhost:8000`

### Extra build step for non-modern browsers (Internet Explorer/Safari)

To make the code compatible with older browsers babel is used. First you'll have to locally install a copy of babel for the build tools to use. In order to install babel you need yet another dependency manager: `npm`. Install this first.

Now create a new directory `buildtools`:

	mkdir buildtools
	cd buildtools

Create a new npm project:

	npm init

You can enter through all the questions, they are unimportant for building the project.

Next install the required dependencies:

    `npm install babel-cli`
    `npm install babel-preset-es2015-ie`

Now you can build the project by navigating to the `build` directory:

	cd ../build

And running the following python command, as build script is written in python2:

	python build.py

The compiled version of the application will be located in the root directory under the name `index-mini.html`.