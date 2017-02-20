class Router {

	constructor(app, context){
		this.app = app;
		this.context = context;

		this._registerScreen(Router.PAGE_MENU, "Menu");
		this._registerScreen(Router.PAGE_MENU_LEVELS, "Levels");
		this._registerScreen(Router.PAGE_GAME, "Game");
		this._registerScreen(Router.PAGE_LEVEL_END_SCREEN, "LevelEndScreen");
		this._registerScreen(Router.PAGE_LEVEL_FAILED_SCREEN, "LevelFailedScreen");
		this._registerScreen(Router.PAGE_MISSION_SCREEN, "MissionScreen");
		this._registerScreen(Router.PAGE_SETTINGS_SCREEN, "SettingsScreen");

		this.active_page = null;
		this.active_page_id = null;
		this.localeChanged = false;
		this.localeUpdates = {};

		window.addEventListener('hashchange', this.cb(this.hashChanged));
	}

	showPage(page, invalidate = false){
		switch(page){
			case Router.PAGE_MENU:
			case Router.PAGE_GAME:
			case Router.PAGE_MENU_LEVELS:
			case Router.PAGE_LEVEL_END_SCREEN:
			case Router.PAGE_LEVEL_FAILED_SCREEN:
			case Router.PAGE_MISSION_SCREEN:
			case Router.PAGE_SETTINGS_SCREEN:
				this.active_page_id = page;
				window.location.hash = page.toString();
				if(invalidate || this.shouldUpdateLocale(page)){
					this.localeUpdates[page.toString()] = true;
					this.context.state.add(page, this.createState(page));
				}

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
			{ title: "MenuMainPlay", action: this.cb(this.showLevels) },
			{ title: "MenuMainHighscores", action: () => {} },
			{ title: "MenuMainSettings", action: this.cb(() => this.showSettingsScreen(true)) },
			{ title: "MenuMainQuit", action: () => {} }
		]);
	}

	createLevelsMenu(){
		return new LevelsMenu(this.app, this.context);
	}

	createLevelEndScreen(){
		return new LevelEndScreen(this.app, this.context);
	}

	createLevelFailedScreen(){
		return new LevelFailedScreen(this.app, this.context);
	}

	createMissionScreen(){
		return new MissionScreen(this.app, this.context);
	}

	createSettingsScreen(){
		return new SettingsScreen(this.app, this.context);
	}

	createState(state){
		switch(state){
			case Router.PAGE_MENU_LEVELS:
				return this.cb(this.createLevelsMenu);
			case Router.PAGE_GAME:
				return this.cb(() => new Game(this.app, this.context));
			case Router.PAGE_MENU:
				return this.cb(this.createMenu);
			case Router.PAGE_LEVEL_END_SCREEN:
				return this.cb(this.createLevelEndScreen);
			case Router.PAGE_LEVEL_FAILED_SCREEN:
				return this.cb(this.createLevelFailedScreen);
			case Router.PAGE_MISSION_SCREEN:
				return this.cb(this.createMissionScreen);
			case Router.PAGE_SETTINGS_SCREEN:
				return this.cb(this.createSettingsScreen);
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
			switch(pageInt){
				case Router.PAGE_GAME:
				case Router.PAGE_LEVEL_END_SCREEN:
				case Router.PAGE_LEVEL_FAILED_SCREEN:
				case Router.PAGE_MISSION_SCREEN:
					// These are all illegal game states to return to, keep going back
					// untill a legal state is reached
					window.history.back();
					break;
				case Router.PAGE_MENU:
				case Router.PAGE_MENU_LEVELS:
				case Router.PAGE_SETTINGS_SCREEN:
				default:
					// These are all legal states to return to
					this.showPage(pageInt);
					break;
			}
		}
	}

	invalidateLocale(){
		this.localeChanged = true;

		for(var key in this.localeUpdates){
			this.localeUpdates[key] = false;
		}
	}

	shouldUpdateLocale(page){
		page = page.toString();
		if(!(page in this.localeUpdates)){
			this.localeUpdates[page] = true;
			return true;
		}
		else if(!this.localeUpdates[page]){
			this.localeUpdates[page] = true;
			return true;
		}
		return false;
	}

	_registerScreen(pageid, pagename){
		this.context.state.add(pageid, this.createState(pageid));

		this["show"+pagename] = this.cb(function(invalidate = false){
			this.showPage(pageid, invalidate);
		});

		this["get"+pagename] = this.cb(function(cb){
			this.getPage(pageid, cb);
		});
	}

	cb(fun){ return ownedCallback(this, fun); }
}

// Statics
Router.PAGE_MENU = 0;
Router.PAGE_MENU_LEVELS = 1;
Router.PAGE_GAME = 2;
Router.PAGE_LEVEL_END_SCREEN = 3;
Router.PAGE_LEVEL_FAILED_SCREEN = 4;
Router.PAGE_MISSION_SCREEN = 5;
Router.PAGE_SETTINGS_SCREEN = 6;