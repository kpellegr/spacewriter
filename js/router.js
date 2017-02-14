class Router {

	constructor(app, context){
		this.app = app;
		this.context = context;

		this.context.state.add(Router.PAGE_MENU, this.cb(this.createMenu));
		this.context.state.add(Router.PAGE_MENU_LEVELS, this.cb(this.createLevelsMenu));
		this.context.state.add(Router.PAGE_GAME, function(){ return new Game(app, context); });

		this.active_page = null;
		this.active_page_id = null;

		window.addEventListener('hashchange', this.cb(this.hashChanged));
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
		switch(page){
			case Router.PAGE_MENU:
			case Router.PAGE_GAME:
			case Router.PAGE_MENU_LEVELS:
				this.active_page_id = page;
				window.location.hash = page.toString();
				this.context.state.start(page.toString());
			default:
				break;
		}
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
		return new LevelsMenu(this.app, this.context);
	}

	hashChanged(e){
		var h = window.location.hash.substr(1);
		var pageInt = parseInt(h);
		var currentPage = parseInt(this.active_page_id);

		if(pageInt !== currentPage){
			this.showPage(pageInt);
		}
	}

	cb(fun){ return ownedCallback(this, fun); }
}

// Statics
Router.PAGE_MENU = 0;
Router.PAGE_MENU_LEVELS = 1;
Router.PAGE_GAME = 2;