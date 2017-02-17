class MissionScreen extends BaseDialog {
	constructor(app, game){
		super(app, game);

		this.textPadding = this.dialogSize * .05;
		this.textWidth = this.dialogSize - 2*this.textPadding;
		this.dragListener = new SimpleDragListener(this.game);
		this.dragListener.setLowerBounds(0, -SimpleDragListener.INFINITE);
		this.dragListener.setUpperBounds(0, 0);

		this.validMission = true;
	}

	setData(missionData){
		this.data = missionData;
	}

	create(){
		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels[this.data.level];
		this.buttons = [
			{ title: "ButtonStart", action: this.cb(() => this.app.beginLevel(this.data.level)) }
		];

		if(this.levelData.mission && this.levelData.mission.title && this.levelData.mission.description){
			this.title = this.levelData.mission.title;
			
			super.create();

			this.missionDescription = this.game.add.text(0, 0, this.translate.get(this.levelData.mission.description), 
				{ font: '12px Arial', fill: '#ccc', align: 'left', wordWrap: true, wordWrapWidth: this.textWidth });

			this.missionDescription.setTextBounds(this.dialogX + this.textPadding, 
				this.dialogY + this.textPadding, this.textWidth, this.textWidth);

			var maskHeight = this.dialogSize - this.btnHeight;
			this.mask = this.game.add.graphics(0, 0);
			this.mask.beginFill("black");
			this.mask.drawRect(0, this.dialogY, this.width, maskHeight);
			this.mask.endFill();

			this.missionDescription.mask = this.mask;

			this.dragListener.setLowerBounds(0, -this.missionDescription.height + maskHeight);
		}
		else{
			// No mission set, just start the level
			this.validMission = false;
			setTimeout(this.buttons[0].action, 50);
		}
	}

	update(){
		super.update();

		if(this.validMission){
			this.dragListener.update();
			var y = this.dragListener.y;
			this.missionDescription.setTextBounds(this.dialogX + this.textPadding, 
				this.dialogY + this.textPadding + y, this.textWidth, this.textWidth);
		}
	}
}