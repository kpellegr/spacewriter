class Router {

	constructor(app, context){
		this.app = app;
		this.context = context;

		this.context.state.add(Router.PAGE_MENU, this.cb(this.createMenu));
		this.context.state.add(Router.PAGE_MENU_LEVELS, this.cb(this.createLevelsMenu));
		this.context.state.add(Router.PAGE_GAME, function(){ return new Game(app, context); });

		this.active_page = null;
		this.active_page_id = null;
	}

	showMenu(){
		this.showPage(Router.PAGE_MENU);
	}

	showLevels(){
		this.showPage(Router.PAGE_MENU_LEVELS);
	}

	showGame(){
		this.showPage(Router.PAGE_GAME);
	}

	getMenu(cb){
		this.getPage(Router.PAGE_MENU, cb);
	}

	getGame(cb){
		this.getPage(Router.PAGE_GAME, cb);
	}

	showPage(page){
		console.log(page);
		switch(page){
			case Router.PAGE_MENU:
			case Router.PAGE_GAME:
			case Router.PAGE_MENU_LEVELS:
				this.context.state.start(page.toString());
			default:
				break;
		}

		this.active_page_id = page;
	}

	getPage(page, cb){
		if(page === this.active_page_id){
			return cb(this.context.state.states[page.toString()]);
		}
		return null;
	}

	createMenu(){
		return new Menu(this.app, this.context, [
			{ title: "PLAY", action: this.cb(this.showLevels) },
			{ title: "HIGHSCORES", action: () => {} },
			{ title: "SETTINGS", action: () => {} },
			{ title: "QUIT", action: () => {} }
		]);
	}

	createLevelsMenu(){
		//var items = [{ title: "<- BACK", action: this.cb(this.showMenu) }];
		return new LevelsMenu(this.app, this.context);
	}

	cb(fun){ return ownedCallback(this, fun); }
}

// Statics
Router.PAGE_MENU = 0;
Router.PAGE_MENU_LEVELS = 1;
Router.PAGE_GAME = 2;