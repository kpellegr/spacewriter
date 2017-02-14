class GameState {
	constructor(app){
		this.app = app;
		this.localStore = new LocalStore("GameState");
		this.data = this.localStore.loadJson() || {
			unlockedIndex: 0
		};
		this.invalidate();
	}

	getUnlockedIndex(){
		return 5;//this.data.unlockedIndex;
	}

	invalidate(){
		this.localStore.store(this.data);
	}
}