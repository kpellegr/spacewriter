class App {

	constructor(args){
		this.width = 480;
		this.height = 800;

		this.handwritingInput = args.handwritingInput;
		this.gameCanvas = args.gameCanvas;
		this.context = new Phaser.Game(this.width, this.height, Phaser.AUTO, this.getGameCanvas());
		this.router = new Router(this, this.context);
		this.state = new GameState(this);

		this.router.showMenu();
		this.setupHandwriting();
	}

	setupHandwriting(){
		this.handwritingInput.addEventListener("myscript-text-web-result", this.cb(function(a){
			try {
				var segmentResults = a.detail.result.textSegmentResult;
				var candidates = segmentResults.candidates;
				var labels = candidates.map(c => c.label.toLowerCase());
				
				console.log("text", segmentResults, labels);

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

	getGameCanvas(){
		return this.gameCanvas;
	}

	startLevel(level){
		this.router.showGame();
		this.router.getGame(g => g.loadLevel(level));
	}

	cb(fun){
		return ownedCallback(this, fun);
	}

}