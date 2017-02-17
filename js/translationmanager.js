class TranslationManager {
	constructor(game, locale){
		this.game = game;
		this.locale = locale;
	}

	preload(){
		// Load the selected language
		var strippedMain = this._strippedLocale(this.locale);
		this.game.load.text(this.locale, 'asset/data/translate/'+strippedMain+'.json');
	    
		// Load the fallback language
		var stripped = this._strippedLocale(TranslationManager.KEY_FALLBACK);
		this.game.load.text(TranslationManager.KEY_FALLBACK, 'asset/data/translate/' + stripped + '.json');
	}

	create(){
		this.mainDict = JSON.parse(this.game.cache.getText(this.locale));
		this.fallbackDict = JSON.parse(this.game.cache.getText(TranslationManager.KEY_FALLBACK));
	}

	get(key){
		if(this.mainDict && this.fallbackDict){
			if(key in this.mainDict){
				return this.mainDict[key];
			}
			else if(key in this.fallbackDict){
				return this.fallbackDict[key];
			}
		}
		return key;
	}

	_strippedLocale(key){
		return key.replace("translate_", "");
	}
}

TranslationManager.KEY_NL = "translate_nl";
TranslationManager.KEY_EN = "translate_en";
TranslationManager.KEY_FALLBACK = TranslationManager.KEY_EN;