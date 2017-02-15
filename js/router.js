class Router {

	constructor(app, context){
		this.app = app;
		this.context = context;

		this.context.state.add(Router.PAGE_MENU, this.createState(Router.PAGE_MENU));
		this.context.state.add(Router.PAGE_MENU_LEVELS, this.createState(Router.PAGE_MENU_LEVELS));
		this.context.state.add(Router.PAGE_GAME, this.createState(Router.PAGE_GAME));

		this.active_page = null;
		this.active_page_id = null;

		window.addEventListener('hashchange', this.cb(this.hashChanged));
	}

	showMenu(invalidate = false){
		this.showPage(Router.PAGE_MENU, invalidate);
	}

	showLevels(invalidate = false){
		this.showPage(Router.PAGE_MENU_LEVELS, invalidate);
	}

	showGame(invalidate = false){
		this.showPage(Router.PAGE_GAME, invalidate);
	}

	getMenu(cb){
		this.getPage(Router.PAGE_MENU, cb);
	}

	getGame(cb){
		this.getPage(Router.PAGE_GAME, cb);
	}

	showPage(page, invalidate = false){
		switch(page){
			case Router.PAGE_MENU:
			case Router.PAGE_GAME:
			case Router.PAGE_MENU_LEVELS:
				this.active_page_id = page;
				window.location.hash = page.toString();
				if(invalidate)
					this.context.state.add(page, this.createState(page));

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
			{ title: "PLAY", action: this.cb(() => this.showLevels()) },
			{ title: "HIGHSCORES", action: () => {} },
			{ title: "SETTINGS", action: () => {} },
			{ title: "QUIT", action: () => {} }
		]);
	}

	createLevelsMenu(){
		return new LevelsMenu(this.app, this.context);
	}

	createState(state){
		switch(state){
			case Router.PAGE_MENU_LEVELS:
				return this.cb(this.createLevelsMenu);
			case Router.PAGE_GAME:
				return this.cb(() => new Game(this.app, this.context));
			case Router.PAGE_MENU:
				return this.cb(this.createMenu);
			default:
				break;
		}
		return null;
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