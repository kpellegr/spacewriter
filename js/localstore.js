/*
	Wrapper around the HTML5 localstorage object that represents a single
	instance of a stored object. For every new object you want to persist
	you should use a different identifier inside the constructor.
*/
class LocalStore {
	/*
		@param key The identifier to use for this localstorage object
	*/
	constructor(key){
		this.key = key;
	}

	/*
		@return The stored data as text (serialized)
	*/
	loadText(){
		if(window.localStorage){
			return window.localStorage.getItem(this.key);
		}
		return null;
	}

	/*
		@return The stored data as JSON (deserialized)
	*/
	loadJson(){
		return JSON.parse(this.loadText());
	}

	/*
		Updates the persisted data

		@param data The data to persist
	*/
	store(data){
		if(window.localStorage)
			window.localStorage.setItem(this.key, JSON.stringify(data));
	}
}