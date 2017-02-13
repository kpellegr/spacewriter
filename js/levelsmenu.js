/*
	Displays a list of all available levels
*/
class LevelsMenu extends Menu {

	constructor(app, context){
		super(app, context, []);
	}

	preload(){
		super.preload();

	    this.game.load.text('levels', 'asset/data/levels.json');
	    var levels = JSON.parse(this.game.cache.getText('levels')).levels;

	    this.menu = [{title: "<- BACK", action: this.cb(() => this.app.router.showMenu()) }];

	    var startLevel = this.cb(l => this.startLevel(l));

	    levels.forEach(this.cb(l => this.menu.push({
	    	title: l.name,
	    	action: (function(level){ return () => startLevel(level); })(l)
	    })));
	}

	startLevel(level){
		this.app.startLevel(level);
	}
}