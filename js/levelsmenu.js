/*
	Displays a list of all available levels
*/
class LevelsMenu extends Menu {

	constructor(app, context){
		super(app, context, []);
	}

	preload(){
		super.preload();

		this.game.load.atlasXML('level_atlas', 'asset/sprites/planets.png', 'asset/sprites/planets.xml');
	    this.game.load.text('levels', 'asset/data/levels.json');
	    var levels = JSON.parse(this.game.cache.getText('levels')).levels;
	    var startLevel = this.cb(l => this.startLevel(l));

	    this.menu = levels.map(this.cb(l => ({
	    	title: l.name,
	    	action: (function(level){ return () => startLevel(level); })(l)
	    })));
	}

	create(){
		// Draw background
		this.starfield = this.game.add.tileSprite(0, 0, this.width, this.height, 'background');

		var offset = 150;
		this.menu.forEach(this.cb(function(item, index){
			var levelSprite = this.game.add.sprite(this.width*(index % 2 == 0 ? .25 : .75), this.height - offset, 'level_atlas', 'level'+index+'.png');
			levelSprite.anchor.x = .5;
			levelSprite.anchor.y = .5;

			if(index > 0){
				levelSprite.alpha = .5;
			}else{
				levelSprite.inputEnabled = true;
				levelSprite.events.onInputDown.add(item.action, this);
			}

			offset += 100;
		}));


		var g = this.game.add.graphics(0, 0);
		g.beginFill("black")
		g.drawRect(0, 0, this.width, 100);
		g.endFill();
		g.inputEnabled = true;
		g.events.onInputDown.add(this.cb(() => this.app.router.showMenu()), this);

		var text = this.game.add.text(0, 0, "<- BACK", { font: "20px Arial Black", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		text.setTextBounds(0, 0, this.width, 100);
	}

	startLevel(level){
		this.app.startLevel(level);
	}
}