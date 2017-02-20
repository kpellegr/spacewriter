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

	npm install babel-cli
	npm install babel-preset-es2015-ie

Now you can build the project by navigating to the `build` directory:

	cd ../build

And running the following python command, as build script is written in python2:

	python build.py

The compiled version of the application will be located in the root directory under the name `index-mini.html`.


## Config

### Levels

The game's levels can be configured using the `asset/data/levels.json` file. Each level is a json object inside
the `levels` array. The object can have several properties, most of them are required:

```
	...

{
	"name": "TitleLevel", /* Translation key of the level title */
	"fromdict": 1, /* Index inside the word dictionary to start at for picking words in the level */
	"todict": 26, /* Index inside the word dictionary to end at */
	"maxenemies": 3, /* How many asteroids should alive simultaneously at most */
	"checkpoint": true, /* [OPTIONAL] If the level is a checkpoint, will be displayed inside the level selector as a planet instead of an asteroid */
	"planet": "level0.png", /* [REQUIRED when checkpoint == true] The name of the sprite to display in the level selector */
	"distance": 100, /* Distance you need to "fly" in order to complete the level, each letter of a completed word gains 1 distance */
	"mission": {
		"title": "TitleMission", /* Translation key that contains the mission title */
		"description": "DescriptionMission" /* Translation key that contains the mission description */
	}
}

	...
```

The chronological order of the levels will be used to determine their order in the game.


### Translations

The game uses a central `TranslationManager` module to handle all strings that are displayed. Currently
config files for both English and Dutch exist inside the `asset/data/translate` directory. 

#### Adding a language

To add a new language it is sufficient to create a new config file inside said directory and give it a sensible
name (e.g. the locale ISO code). To register the file as a language you have to add a key for the language
to the `js/translationmanager.js` file. Also register the key in that same file by adding it to the array
inside the `getLanguages` method.

The key has to start with `translate_` followed by the name of the config file, without the `.json` extension.
For the English config file with name `en.json` this would become `translate_en`.

Inside the settings screen the language also needs to have a proper name. To do this add a new string to
each language config file for your newly added language, the translation key is constructed in the following
way:

	SettingLanguage{name of your translation file}

Without the brackets.

So for the en.json file this would be `SettingLanguageen`. This is case sensitive!

#### Setting the fallback language

Whenever a key isn't translated in the currently active language the fallback language will be querried instead.
To change the fallback language all you have to do is change the value of the `KEY_FALLBACK` inside the
`js/translationmanager.js` file

#### Adding a translation key

Adding a new key for usage inside the game is simple. Simply add it to the translate config files as a json
key attribute and add the corresponding translated value as the value for that key. You don't have to
specify the translation for every language for it to work. If the key is not specified in the currently
active language the fallback language will be used (if the key is available there). If unavailable in the
fallback language the key itself will be used instead. In this way you will never encounter an empty string
and you'll see immediately which strings you forgot to translate.

#### `TranslationManager` setup

To use a key you need an instance of the `TranslationManager` class. This class follows the same lifecycle
as the `Phaser` game objects (all screens). It also has the `preload` and `create` methods. You'll have to
call there manually from within your game objects. When those 2 methods have been called the manager will be
fully initialized and ready to use.

Thankfully all classes that extend from `BaseView` already have an instance available. You can access this 
by using the `this.translate` property. Currently all different screens have `BaseView` as an anscestor. 
NOTE: the `TranslationManager` is initialized after `super.create()` is called and will therefor be 
unavailble inside the constructor. This should not pose any issues as all text that is drawn can only 
be drawn as early as the `create` method.

It is also crucial that you call the super methods for `preload` and `create` if you decide to override them.

#### Translating a key

To translate a key in the currently active language all you have to do is call the `get(yourKeyToTranslate)`
method of the `TranslationManager`. For classes that extend `BaseView` this would be `this.translate.get(yourKeyToTranslate)`.