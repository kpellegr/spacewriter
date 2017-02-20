/*
	Generic class to create a menu with the provided
	menu options as menu items.
*/
class Menu extends BaseView {

	/*
		Create a new menu view provided an instance of App and
		an array of javascript objects with a title and action
		property. Titles will be displayed in the menu and the
		provided action will be called on click.
	*/
	constructor(app, context, options){
		super(app, context);

		this.padding = app.width / 3.0; 
		this.menu    = options;
	}

	create(){
		super.create();

		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels;

		var availableHeight = this.height - this.padding*2;
		var heightPerItem = availableHeight / this.menu.length;
		var y = this.padding;

		for(var i = 0; i < this.menu.length; i++){
			var title  = this.translate.get(this.menu[i].title).toUpperCase();
			var action = this.menu[i].action;

			// add entry to menu
			var text = this.game.add.text(0, 0, title, Theme.Text.TitleLarge);
			text.setTextBounds(0, y, this.width, heightPerItem);
			text.inputEnabled = true;
			text.events.onInputDown.add(action, this);

			y += heightPerItem;
		}
	}
}