class LevelEndScreen extends BaseView {

	constructor(app, game){
		super(app, game);
	}

	setData(levelData){
		this.data = levelData;
	}

	create(){
		super.create();

		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels[this.data.level];

		console.log(this.levelData, this.data);

		var t = this.game.add.text(0, 0, "LEVEL COMPLETE: " + this.getStarCount(), { color: "white" });
		t.inputEnabled = true;
		t.events.onInputDown.add(this.cb(() => this.app.advanceLevelEndScreen()), this);

		var starCount = this.getStarCount();
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