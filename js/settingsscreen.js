class SettingsScreen extends Menu {
	constructor(app, context){
		super(app, context, []);

		this.currentLocale = app.state.getLocale();
		this.currentLocaleCode = this.currentLocale.replace("translate_", "");
		this.menu = [
			{ title: "SettingLanguage" + this.currentLocaleCode, action: this.cb(this.rotateLanguage) }
		];
	}

	rotateLanguage(){
		var current = this.app.state.getLocale();
		switch(current){
			case TranslationManager.KEY_EN:
				this.app.state.setLocale(TranslationManager.KEY_NL);
				break;
			case TranslationManager.KEY_NL:
				this.app.state.setLocale(TranslationManager.KEY_EN);
				break;
			default: break;
		}

		this.app.router.invalidateLocale();
		this.app.router.showSettingsScreen(true);
	}
}