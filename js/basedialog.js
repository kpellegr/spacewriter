class BaseDialog extends BaseView {
	constructor(app, context){
		super(app, context);

		this.padding = this.width / 10;
		this.dialogSize = this.width - 2*this.padding;
		this.dialogX = (this.width - this.dialogSize)/2;
		this.dialogY = (this.height - this.dialogSize)/2;
		this.lineWidthDialog = 8;
		this.lineWidthBtn = 4;
		this.btnHeight    = this.dialogSize * .15;

		this.backgroundColor = Theme.Color.Background;
		this.borderColor = Theme.Color.DialogBorder;
		this.title = "__DIALOG__";
		this.buttons = [];
	}

	create(){
		super.create();

		this.levelData = this.getLevels()[this.data.level];

		var t = this.game.add.text(0, 0, this.translate.get(this.title), Theme.Text.TitleMedium);
		t.setTextBounds(0, 0, this.width, this.dialogY);

		// Draw the dialog frame
		var dialog = this.game.add.graphics(this.dialogX - this.lineWidthDialog/2, this.dialogY - this.lineWidthDialog/2);
		dialog.beginFill(this.backgroundColor);
		dialog.lineStyle(this.lineWidthDialog, this.borderColor, 1);
		dialog.drawRect(0, 0, this.dialogSize + this.lineWidthDialog, this.dialogSize + this.btnHeight/2 + this.lineWidthDialog*2);
		dialog.endFill();

		// Draw buttons
		this.drawButtons();
	}

	drawButtons(){
		var btnCount = this.buttons.length;
		if(btnCount == 0) return;

		var btnHeight    = this.btnHeight;
		var btnPadding   = this.lineWidthDialog;
		var btnFullWidth = ((this.dialogSize-btnPadding) / btnCount);
		var btnWidth     = btnFullWidth - btnPadding;

		this.buttons.forEach(this.cb(function(btn, i){
			var menuBg = this.game.add.graphics(this.dialogX + i * btnFullWidth + btnPadding, this.dialogY + this.dialogSize - btnHeight/2);
			menuBg.beginFill(this.backgroundColor);
			menuBg.lineStyle(this.lineWidthBtn, this.borderColor, 1);
			menuBg.drawRect(0, 0, btnWidth, btnHeight);
			menuBg.inputEnabled = true;
			menuBg.events.onInputDown.add(btn.action, this);

			var menuBtn = this.game.add.text(0, 0, this.translate.get(btn.title), Theme.Text.TitleSmall);
			menuBtn.setTextBounds(this.dialogX + i * btnFullWidth, this.dialogY + this.dialogSize - btnHeight/2 + this.lineWidthDialog/2, btnFullWidth, btnHeight);
		}));
	}
}