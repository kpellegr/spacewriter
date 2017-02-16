class MissionScreen extends BaseDialog {
	constructor(app, game){
		super(app, game);

		this.title = "MISSION"
		this.buttons = [
			{ title: "bla", action: this.cb(() => this.app.router.showLevels()) }
		];
		this.textPadding = this.dialogSize * .05;
		this.textWidth = this.dialogSize - 2*this.textPadding;
		this.dragListener = new SimpleDragListener(this.game);
		this.dragListener.setLowerBounds(0, -999999);
	}

	setData(missionData){
		this.data = missionData;
	}

	create(){
		super.create();

		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels[this.data.level];

		this.missionTitle = this.game.add.text(0, 0, this.levelData.mission.title);
		this.missionDescription = this.game.add.text(0, 0, this.levelData.mission.description, 
			{ font: '12px Arial', fill: '#ccc', align: 'left', wordWrap: true, wordWrapWidth: this.textWidth });

		this.missionDescription.setTextBounds(this.dialogX + this.textPadding, this.dialogY + this.textPadding, this.textWidth, this.textWidth);

		this.mask = this.game.add.graphics(0, 0);
		this.mask.beginFill("black");
		this.mask.drawRect(0, this.dialogY, this.width, this.dialogSize - this.btnHeight);
		this.mask.endFill();

		this.missionDescription.mask = this.mask;
	}

	update(){
		this.dragListener.update();

		var y = Math.min(0, this.dragListener.y);
		this.missionDescription.setTextBounds(this.dialogX + this.textPadding, this.dialogY + this.textPadding + y, this.textWidth, this.textWidth);
	}
}