class LevelEndScreen extends BaseDialog {

	constructor(app, game){
		super(app, game);

		this.title = "TitleLevelCompleted";
		this.buttons = [
			{ title: "ButtonMenu", action: this.cb(() => this.app.advanceLevelEndScreen()) },
			{ title: "ButtonNext", action: this.cb(() => this.app.advanceLevelEndScreenNextLevel(this.data.level)) },
		];
	}

	setData(levelData){
		this.data = levelData;
	}

	create(){
		var levels = this.getLevels();
		// Check if last level
		if(levels.length - 1 == this.data.level)
			// Remove the next button
			this.buttons.splice(1, 1);

		// This will draw the buttons
		super.create();

		var levelData = levels[this.data.level];

		// Draw the stars
		var stars = this.createStars();
		var starCount = this.getStarCount();
		var starScale = this.dialogSize / (stars[0].width * stars.length) / 1.5;

		var levelTextHeight = this.dialogSize * .125;

		var starYPos = (this.height - this.dialogSize)/2 + levelTextHeight + this.lineWidthDialog;
		stars.forEach(this.cb((s, i) => {
			s.width  *= starScale;
			s.height *= starScale;

			s.anchor.set(.5, .5);
			s.x = this.width/2 + (i - Math.floor(stars.length/2)) * (s.width * 1.25);
			s.y = starYPos + s.height;

			if(i == 1) s.y -= s.height/2;

			s.alpha = 0;
			if(i < starCount){
				s.scale.set(3.0 * starScale);
				this.game.add.tween(s.scale).to( { x: starScale, y: starScale }, 300, Phaser.Easing.Linear.None, true, 300*i);
				this.game.add.tween(s).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 300*i);
			}else{
				s.scale.set(starScale);
				this.game.add.tween(s).to( { alpha: .35 }, 300, Phaser.Easing.Linear.None, true, 300*i);
			}
		}));

		var levelText = this.game.add.text(0, 0, this.translate.get(levelData.name), Theme.Text.SubTitleLarge);
		levelText.setTextBounds(this.dialogX, this.dialogY + this.lineWidthDialog, this.dialogSize, levelTextHeight);

		this.persistScore();
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

		if(streak >= tresholdThree)
			return 3;
		else if(streak >= tresholdTwo)
			return 2;
		else if(streak >= tresholdOne)
			return 1;
		return 0;
	}

	createStars(){
		return [
			this.game.add.sprite(0, 0, "space_atlas", 'star_bronze.png'),
			this.game.add.sprite(0, 0, "space_atlas", 'star_silver.png'),
			this.game.add.sprite(0, 0, "space_atlas", 'star_gold.png')
		];
	}

	persistScore(){
		var persist = this.app.state.getLevelData(this.data.level);
		persist.starcount = Math.max(this.getStarCount(), persist.starcount);
		this.app.state.setLevelData(this.data.level, persist);
	}
}