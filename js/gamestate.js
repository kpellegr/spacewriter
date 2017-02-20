class GameState {
	constructor(app){
		this.app = app;
		this.localStore = new LocalStore("GameState");

		this.data = this.localStore.loadJson() || {};
		this._setDefault("unlockedIndex", 0);
		this._setDefault("levels", {});
		this._setDefault("locale", TranslationManager.KEY_FALLBACK);
		this.invalidate();
	}

	getUnlockedIndex(){
		return this.data.unlockedIndex;
	}

	setUnlockedIndex(index){
		this.data.unlockedIndex = index;
		this.invalidate();
	}

	getLocale(){
		return this.data.locale;
	}

	setLocale(locale){
		this.data.locale = locale;
		this.invalidate();
	}

	setLevelData(index, levelData){
		this.data.levels[index.toString()] = levelData;
		this.invalidate();
	}

	getLevelData(index){
		if(index.toString() in this.data.levels)
			return this.data.levels[index.toString()];
		return {
			starcount: 0
		};
	}

	getLevels(){
		return this.data.levels;
	}

	invalidate(){
		this.localStore.store(this.data);
	}

	_setDefault(name, value){
		if(!(name in this.data))
			this.data[name] = value;
	}
}