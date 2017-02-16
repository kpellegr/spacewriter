class LevelFailedScreen extends BaseDialog {

	constructor(app, game){
		super(app, game);

		this.title = "LEVEL FAILED";
		this.buttons = [
			{ title: "MENU", action: this.cb(() => this.app.router.showLevels()) },
			{ title: "RETRY", action: this.cb(() => this.app.startLevel(this.data.level)) },
		];
	}

	setData(levelData){
		this.data = levelData;
	}

	create(){
		super.create();

		var levelTextHeight = this.dialogSize * .125;

		var levelText = this.game.add.text(0, 0, "Level "+this.data.level, { font: (levelTextHeight*.65)+"px Arial", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		levelText.setTextBounds(this.dialogX, this.dialogY + this.lineWidthDialog, this.dialogSize, levelTextHeight);
	}
}