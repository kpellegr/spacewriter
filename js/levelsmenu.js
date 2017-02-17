/*
	Displays a list of all available levels
*/
class LevelsMenu extends BaseView {

	constructor(app, context){
		super(app, context, []);

		this.sprites = [];
		this.clickableItems = [];
		this.dragListener = new SimpleDragListener(this.game);
		this.dragListener.setLowerBounds(0, 0);
	}

	preload(){
		super.preload();

	    var levels = JSON.parse(this.game.cache.getText('levels')).levels;
	    var startLevel = this.cb(l => this.startLevel(l));

	    this.menu = levels.map(this.cb((l, levelIndex) => ({
	    	data: l,
	    	action: (function(level){ return () => startLevel(level); })(levelIndex)
	    })));
	}

	create(){
		super.create();

		var getXPos = this.cb(function(levelIndex){
			return (Math.cos(levelIndex * Math.PI / 8.0) * .5 + .5) * this.width/2 + this.width/4;
		});

		var offset = 50;
		this.menu.forEach(this.cb(function(item, index){
			var levelSprite;
			var x = getXPos(index);
			var y, spriteSize, starOffset, starScale;
				
			if(item.data.checkpoint){
				offset += 75;
				y = this.height - offset;
				levelSprite = this.game.add.sprite(x, y, 'planet_atlas', item.data.planet);
				offset += 75;
				spriteSize = 150;
				starOffset = 75;
				starScale = 1;
			}else{
				offset += 25;
				y = this.height - offset;
				levelSprite = this.game.add.sprite(x, y, 'space_atlas', 'meteorGrey_big1.png');
				levelSprite.scale.set(.25);
				offset += 25;
				spriteSize = 50;
				starOffset = 25;
				starScale = .5;
			}

			this.dragListener.setUpperBounds(0, offset + 50 - this.height);
			
			levelSprite.anchor.x = .5;
			levelSprite.anchor.y = .5;

			if(index > this.app.state.getUnlockedIndex()){
				levelSprite.alpha = .5;
			}else{
				var g = this.game.add.graphics(x, y);
				g.alpha = 0;
				g.beginFill("black");
				g.drawCircle(0, 0, spriteSize);
				g.endFill();

				this.dragListener.registerClick(g, item.action);
				this.sprites.push(g);
			}

			var ROTATIONS = 10000;
			this.game.add.tween(levelSprite).to( { rotation: ROTATIONS*2*Math.PI }, (.5 + Math.random()/2.0) * 60000 * ROTATIONS, Phaser.Easing.Linear.InOut, true);
			this.sprites.push(levelSprite);

			var levelData = this.app.state.getLevelData(index);
			if(levelData.starcount > 0){
				var starSprite = this.game.add.sprite(x + starOffset, y, "space_atlas", 
					[null, "star_bronze.png", "star_silver.png", "star_gold.png"][levelData.starcount]);
				starSprite.anchor.set(.5);
				starSprite.scale.set(starScale);
				this.sprites.push(starSprite);
			}
		}));

		this.sprites.forEach(s => s.oldposition = deepCopy(s.position));
	}

	update(){
		super.update();
		this.dragListener.update();

		this.sprites.forEach(this.cb(s => {
			s.position.set(
				s.oldposition.x,
				Math.max(s.oldposition.y, s.oldposition.y + this.dragListener.y)
			);
		}));
	}

	startLevel(level){
		this.app.startLevel(level);
	}
}