/*
	Generic class to create a menu with the provided
	menu options as menu items.
*/
class Menu {

	/*
		Create a new menu view provided an instance of App and
		an array of javascript objects with a title and action
		property. Titles will be displayed in the menu and the
		provided action will be called on click.
	*/
	constructor(app, context, options){
		this.app = app;
		this.game = context;

		//set width and height variables for game
		this.width   = 480;
		this.height  = 800;
		this.padding = 150; 
		this.menu    = options;
	}

	preload(){
		// Load the sprites
		this.game.load.atlasXML('space_atlas', 'asset/sprites/space_atlas.png', 'asset/sprites/space_atlas.xml');
	    this.game.load.image('background', 'asset/backgrounds/darkPurple.png');
	    this.game.load.text('dictionary', 'asset/data/dictionary.txt');
	    this.game.load.text('levels', 'asset/data/levels.json');
	}

	create(){
		//initialize keyboard arrows for the game controls
		this.cursors = this.game.input.keyboard.createCursorKeys();
		var keys = [Phaser.KeyCode.SPACEBAR];
		this.phaserKeys = this.game.input.keyboard.addKeys(keys);
		this.game.input.keyboard.addKeyCapture(keys);

		//add background tiles
		this.starfield = this.game.add.tileSprite(0, 0, this.width, this.height, 'background');
		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels;

		var availableHeight = this.height - this.padding*2;
		var heightPerItem = availableHeight / this.menu.length;
		var y = this.padding;

		for(var i = 0; i < this.menu.length; i++){
			var title  = this.menu[i].title;
			var action = this.menu[i].action;

			// add entry to menu
			var text = this.game.add.text(0, 0, title, { font: "20px Arial Black", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
			text.setTextBounds(0, y, this.width, heightPerItem);
			text.inputEnabled = true;
			text.events.onInputDown.add(action, this);

			y += heightPerItem;
		}
	 	
	}

	update(){

	}

	destroy(){
		this.game.destroy();
	}

	cb(fun){ return ownedCallback(this, fun); }
}