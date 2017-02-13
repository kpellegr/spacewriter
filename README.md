# spacewriter
Game to practice writing

This a simple game written in Javascript (using the Phaser library) to help my son practice his writing.

It is a combination of asteroids and Google's 2016 halloween game. The goal is to destroy asteroids by writing the words that appear on them.


# Build, Install & Run

This project requires `bower` as a dependency manager. Make sure you have it installed.

Then pull this repo and navigate to the root directory. Run the `bower install` command. This will pull in all the dependencies specified in `bower.json`. To run the project you'll have to host a simple HTTP server inside the root directory.

This can be accomplished in multiple ways (node, ruby, python, ...). With python it can be achieved in the following manner:

`python -m SimpleHTTPServer 8000`

This will start a web server available at `localhost:8000`