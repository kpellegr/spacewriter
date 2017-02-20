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
		var langs = this.translate.getLanguages();

		var nextIndex = (langs.indexOf(current) + 1) % langs.length;
		this.app.state.setLocale(langs[nextIndex]);

		// Force all screens to be re-created to ensure the language
		// change is reflected correctly throughout the app
		this.app.router.invalidateLocale();
		this.app.router.showSettingsScreen(true);
	}
}