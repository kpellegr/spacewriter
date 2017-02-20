class LevelFailedScreen extends BaseDialog {

	constructor(app, game){
		super(app, game);

		this.title = "TitleLevelFailed";
		this.buttons = [
			{ title: "ButtonMenu", action: this.cb(() => this.app.router.showLevels()) },
			{ title: "ButtonRetry", action: this.cb(() => this.app.startLevel(this.data.level)) },
		];
	}

	setData(levelData){
		this.data = levelData;
	}

	create(){
		super.create();

		var levelData = JSON.parse(this.game.cache.getText('levels')).levels[this.data.level];

		var levelTextHeight = this.dialogSize * .125;

		var levelText = this.game.add.text(0, 0, this.translate.get(levelData.name), Theme.Text.SubTitleLarge);
		levelText.setTextBounds(this.dialogX, this.dialogY + this.lineWidthDialog, this.dialogSize, levelTextHeight);
	}
}