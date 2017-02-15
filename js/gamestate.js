class GameState {
	constructor(app){
		this.app = app;
		this.localStore = new LocalStore("GameState");
		this.data = this.localStore.loadJson() || {
			unlockedIndex: 0
		};
		this.invalidate();

		console.log(this.data);
	}

	getUnlockedIndex(){
		return this.data.unlockedIndex;
	}

	setUnlockedIndex(index){
		this.data.unlockedIndex = index;
		this.invalidate();
	}

	invalidate(){
		this.localStore.store(this.data);
	}
}