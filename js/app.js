class App {

	constructor(args){
		// Default values, used to determine aspect ratio
		this.handwritingInput = args.handwritingInput;
		this.gameCanvas = args.gameCanvas;
		this.gameContainer = args.gameContainer;
		this.handwritingContainer = args.handwritingContainer;

		Theme.init(480, 800, this.gameContainer);
		this.width  = Theme.getWidth();
		this.height = Theme.getHeight();

		this.gameContainer.style.width = this.width + "px";
		this.handwritingContainer.style["margin-left"] = this.width + "px";

		this.state      = new GameState(this);
		this.context    = new Phaser.Game(this.width, this.height, Phaser.AUTO, this.gameCanvas);
		this.router     = new Router(this, this.context);

		this.router.showMenu();
		this.setupHandwriting();

		//this.router.showLevelEndScreen();
	}

	setupHandwriting(){
		this.handwritingInput.addEventListener("myscript-text-web-result", this.cb(function(a){
			try {
				var segmentResults = a.detail.result.textSegmentResult;
				var candidates = segmentResults.candidates;
				var labels = candidates.map(c => c.label.toLowerCase());

				this.onHandwriteResult(labels);
			}
			catch (e)
			{
				// something went wrong with the event
			}
		}));

		this.handwritingInput.addEventListener("changed", this.cb(setBackoffTimeout(function(){
			// 2 second back off that detects when nothing is input for a while
			// to automatically clear the area
			this.clearHandwriting();
		}, 2000)));
	}

	onHandwriteResult(labels){
		this.router.getGame(game => game.onHandwriteResult(labels));
	}

	clearHandwriting(){
		this.handwritingInput.clear();
	}

	startLevel(level){
		this.router.showMissionScreen(true);
		this.router.getMissionScreen(m => m.setData({ level: level }))
		//this.router.showGame(true);
		//this.router.getGame(g => g.loadLevel(level));
	}

	beginLevel(level){
		this.router.showGame(true);
		this.router.getGame(g => g.loadLevel(level));
	}

	levelCompleted(levelData){
		// Unlock the next level if it hasn't been unlocked
		var level = levelData.level;
		if(this.state.getUnlockedIndex() < level+1){
			this.state.setUnlockedIndex(level+1);
		}

		this.router.showLevelEndScreen(true);
		this.router.getLevelEndScreen(e => e.setData(levelData));
	}

	levelFailed(levelData){
		this.router.showLevelFailedScreen(true);
		this.router.getLevelFailedScreen(f => f.setData(levelData));
	}

	advanceLevelEndScreen(){
		this.router.showLevels(true);
	}

	advanceLevelEndScreenNextLevel(level){
		this.startLevel(level+1);
	}

	cb(fun){
		return ownedCallback(this, fun);
	}
}