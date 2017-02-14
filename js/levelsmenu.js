/*
	Displays a list of all available levels
*/
class LevelsMenu extends BaseView {

	constructor(app, context){
		super(app, context, []);

		this.sprites = [];
		this.dragListener = new SimpleDragListener(this.game);
	}

	preload(){
		super.preload();

	    var levels = JSON.parse(this.game.cache.getText('levels')).levels;
	    var startLevel = this.cb(l => this.startLevel(l));

	    this.menu = levels.map(this.cb(l => ({
	    	data: l,
	    	action: (function(level){ return () => startLevel(level); })(l)
	    })));
	}

	create(){
		super.create();

		var getXPos = this.cb(function(levelIndex){
			return (Math.cos(levelIndex * Math.PI / 8.0) * .5 + .5) * this.width/2 + this.width/4;
		});

		var offset = 50;
		this.menu.forEach(this.cb(function(item, index){
			console.log(item.data);
			var levelSprite;
			var x = getXPos(index);
			var y, spriteSize;
				
			if(item.data.checkpoint){
				offset += 75;
				y = this.height - offset;
				levelSprite = this.game.add.sprite(x, y, 'planet_atlas', item.data.planet);
				offset += 75;
				spriteSize = 150;
			}else{
				offset += 25;
				y = this.height - offset;
				levelSprite = this.game.add.sprite(x, y, 'space_atlas', 'meteorGrey_big1.png');
				levelSprite.scale.set(.25);
				offset += 25;
				spriteSize = 50;
			}
			
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
				g.inputEnabled = true;
				g.events.onInputDown.add(item.action, this);

				this.sprites.push(g);
			}

			this.sprites.push(levelSprite);
		}));

		/*var g = this.game.add.graphics(0, 0);
		g.beginFill("black")
		g.drawRect(0, 0, this.width, 100);
		g.endFill();
		g.inputEnabled = true;
		g.events.onInputDown.add(this.cb(() => this.app.router.showMenu()), this);

		var text = this.game.add.text(0, 0, "<- BACK", { font: "20px Arial Black", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		text.setTextBounds(0, 0, this.width, 100);
		*/

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

	onPointerAction(e){
		console.log(e);
	}
}