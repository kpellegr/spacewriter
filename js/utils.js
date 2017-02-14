/*
	Utility function that creates a callback function that when called
	multiple times will only handle the last result within the backoff
	value. E.g. backoff is 100ms, the function fires twice with 50ms in
	between both calls, the first call will be scheduled at 100ms, the
	second call at 150ms. Once the first call reaches its scheduled time
	the second call has already arrived and so the first call is dropped.

	After 150ms total the second call's scheduled time is reached and no
	other calls have been received => second call does fire. Very useful
	when dealing with spammy events like window resize which fires for
	every pixel change.

	@param fun Function to schedule
	@param backoff Time in ms to wait for
	@return Wrappd function of fun
*/
function setBackoffTimeout(fun = function(){}, backoff = 0){
	var lastUpdate = new Date().getTime();

	return function(){
		lastUpdate = new Date().getTime();

		setTimeout((function(context, args){
			return function(){
				if(new Date().getTime() - lastUpdate >= backoff){
					fun.apply(context, args);
				}
			}
		})(this, arguments), backoff);
	}
}

/*
	Modifies a function reference's owner. This is very useful
	for passing callbacks and retaining the class as owner.
	Usually the owner becomes the one who calls the callback.

	@param owner Reference to the object who should own the function
	@param fun The function to modify
	@return Wrapped function that when called calls fun with owner
*/
function ownedCallback(owner, fun){
	return function(){ return fun.apply(owner, arguments) }
}

function range(cb, limit, start = 0, step = 1){
	for(var i = start; i < limit; i+=step){
		cb(i);
	}
}

function deepCopy(data){
	return JSON.parse(JSON.stringify(data));
}