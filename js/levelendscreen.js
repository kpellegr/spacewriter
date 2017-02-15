class LevelEndScreen extends BaseView {

	constructor(app, game){
		super(app, game);

		this.padding = this.height / 10;

		this.data = {
			level: 1,
			wordcount: 50,
			combo: {
				maxstreak: 30
			}
		};
	}

	setData(levelData){
		this.data = levelData;
	}

	create(){
		super.create();

		var backgroundColor = 0x040037;
		var borderColor = 0x00C4C4;

		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels[this.data.level];

		console.log(this.levelData, this.data);

		var t = this.game.add.text(0, 0, "LEVEL COMPLETE", { font: "20px Arial", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		t.setTextBounds(0, this.padding, this.width, 20);
		t.inputEnabled = true;
		t.events.onInputDown.add(this.cb(() => this.app.advanceLevelEndScreen()), this);

		var starCount = this.getStarCount();

		// Draw the dialog frame
		var dialogSize = this.width - 2*this.padding;
		var dialogX = (this.width - dialogSize)/2;
		var dialogY = (this.height - dialogSize)/2;
		var dialog = this.game.add.graphics(dialogX, dialogY);
		dialog.beginFill(backgroundColor);
		dialog.lineStyle(8, borderColor, 1);
		dialog.drawRect(0, 0, dialogSize, dialogSize);
		dialog.endFill();

		// Draw the stars
		var stars = [
			this.game.add.sprite(0, 0, "space_atlas", 'star_bronze.png'),
			this.game.add.sprite(0, 0, "space_atlas", 'star_silver.png'),
			this.game.add.sprite(0, 0, "space_atlas", 'star_gold.png')
		];

		var starYPos = (this.height - dialogSize)/2;
		stars.forEach(this.cb((s, i) => {
			s.anchor.set(.5, .5);
			s.x = this.width/2 + (i - Math.floor(stars.length/2)) * (s.width * 1.25);
			s.y = starYPos;

			if(i == 1) s.y -= s.height/2;


			s.alpha = 0;
			if(i < starCount){
				s.scale.set(3.0);
				this.game.add.tween(s.scale).to( { x: 1.0, y: 1.0 }, 300, Phaser.Easing.Linear.None, true, 300*i);
				this.game.add.tween(s).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 300*i);
			}else{
				this.game.add.tween(s).to( { alpha: .35 }, 300, Phaser.Easing.Linear.None, true, 300*i);
			}
		}));

		// Draw buttons

		var menuBg = this.game.add.graphics(dialogX + 10, dialogY + dialogSize - 15);
		menuBg.beginFill(backgroundColor);
		menuBg.lineStyle(4, borderColor, 1);
		menuBg.drawRect(0, 0, dialogSize/2 - 20, 20);
		menuBg.inputEnabled = true;
		menuBg.events.onInputDown.add(this.cb(() => this.app.advanceLevelEndScreen()), this);

		var nextLevelBg = this.game.add.graphics(dialogX + 10, dialogY + dialogSize - 15);
		nextLevelBg.beginFill(backgroundColor);
		nextLevelBg.lineStyle(4, borderColor, 1);
		nextLevelBg.drawRect(dialogSize/2, 0, dialogSize/2 - 20, 20);
		nextLevelBg.inputEnabled = true;
		nextLevelBg.events.onInputDown.add(this.cb(() => this.app.advanceLevelEndScreenNextLevel(this.data.level)), this);

		var menuBtn      = this.game.add.text(0, 0, "MENU", { font: "14px Arial", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		var nextLevelBtn = this.game.add.text(0, 0, "NEXT", { font: "14px Arial", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		menuBtn.setTextBounds(dialogX, dialogY + dialogSize - 15, dialogSize/2, 30);
		nextLevelBtn.setTextBounds(dialogX + dialogSize/2, dialogY + dialogSize - 15, dialogSize/2, 30);
	}

	update(){

	}

	getStarCount(){
		var d = this.levelData.distance;
		var wordcount = this.data.wordcount;
		var streak = this.data.combo.maxstreak;
	
		// streak should be longer than 20% of the word count
		var tresholdOne = .2 * wordcount; 
		// streak should be longer than 50% of the word count
		var tresholdTwo = .5 * wordcount;
		// streak should be longer than 80% of the word count
		var tresholdThree = .8 * wordcount;

		console.log(streak, wordcount);

		if(streak >= tresholdThree)
			return 3;
		else if(streak >= tresholdTwo)
			return 2;
		else if(streak >= tresholdOne)
			return 1;
		return 0;
	}
}