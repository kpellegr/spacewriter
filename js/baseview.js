class BaseView {
	constructor(app, context){
		this.app  = app;
		this.game = context;

		this.width  = 480;
		this.height = 800;
	}

	preload(){
		// Load the sprites
		this.game.load.atlasXML('space_atlas', 'asset/sprites/space_atlas.png', 'asset/sprites/space_atlas.xml');
		this.game.load.atlasXML('planet_atlas', 'asset/sprites/planets.png', 'asset/sprites/planets.xml');
	    this.game.load.image('background', 'asset/backgrounds/darkPurple.png');
	    this.game.load.text('dictionary', 'asset/data/dictionary.txt');
	    this.game.load.text('levels', 'asset/data/levels.json');
	}

	create(){
		// draw background
		this.starfield = this.game.add.tileSprite(0, 0, this.width, this.height, 'background');	 	
	}

	update(){

	}

	destroy(){
		this.game.destroy();
	}

	cb(fun){ return ownedCallback(this, fun); }
}