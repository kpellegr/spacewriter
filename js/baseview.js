class BaseView {
	constructor(app, context){
		this.app  = app;
		this.game = context;
		this.translate = new TranslationManager(this.game, this.app.state.getLocale());

		this.width  = app.width;
		this.height = app.height;
		this.iconSize = this.width / 8;
	}

	preload(){
	    this.translate.preload();
		// Load the sprites
		this.game.load.atlasXML('space_atlas', 'asset/sprites/space_atlas.png', 'asset/sprites/space_atlas.xml');
		this.game.load.atlasXML('planet_atlas', 'asset/sprites/planetsv2.png', 'asset/sprites/planetsv2.xml');
		this.game.load.atlasXML('icon_atlas', 'asset/sprites/icon_atlas.png', 'asset/sprites/icon_atlas.xml');
	    this.game.load.image('background', 'asset/backgrounds/darkPurple.png');
	    this.game.load.text('dictionary', 'asset/data/dictionary.txt');
	    this.game.load.text('levels', 'asset/data/levels.json');
	}

	create(){
		this.translate.create();
		// draw background
		this.starfield = this.game.add.tileSprite(0, 0, this.width, this.height, 'background');
	}

	update(){

	}

	getLevels(){
		return JSON.parse(this.game.cache.getText('levels')).levels;
	}

	getDictionary(){
		return this.game.cache.getText('dictionary').split('\n');
	}

	cb(fun){ return ownedCallback(this, fun); }
}