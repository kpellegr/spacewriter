class App {

	constructor(args){
		this.handwritingInput = args.handwritingInput;

		this.setupHandwriting();

		this.game = new Game(this);
	}

	setupHandwriting(){
		this.handwritingInput.addEventListener("myscript-text-web-result", this.cb(function(a, b, c){
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

		this.handwritingInput.addEventListener("changed", this.cb(setBackoffTimeout(function(a, b, c){
			// 2 second back off that detects when nothing is input for a while
			// to automatically clear the area
			this.clearHandwriting();
		}, 2000)));
	}

	onHandwriteResult(labels){
		this.game.onHandwriteResult(labels);
	}

	clearHandwriting(){
		this.handwritingInput.clear();
	}

	cb(fun){
		return ownedCallback(this, fun);
	}

}