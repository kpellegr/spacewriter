class ComboManager {
	constructor(){
		// max milliseconds/letter to write a word in order to increase the multiplier
		this.COMBO_TRESHOLD      = 1000;
		// time per letter to keep the current combo
		this.COMBO_HOLD_TRESHOLD = 2000;
		this.MAX_MULTIPLIER      = 5;

		this.lastWord  = "";
		this.lastWordTime = 0;
		this.multiplier = 1;
		this.streak = 0;

		// bookkeeping
		this.b_combos = 0;
		this.b_maxmultiplier = 0;
		this.b_maxstreak = 0;
	}

	foundWord(word){
		var time = this.getCurrentTime();
		var isCombo = false;

		if(this.insideTreshold(word)){
			// It's a combo!
			this.multiplier = Math.min(this.MAX_MULTIPLIER, this.multiplier + 1);
			isCombo = true;
		}
		else if(this.insideHoldTreshold(word)){
			// multiplier stays as is
			isCombo = true;
		}else{
			// Reset the multiplier
			this.multiplier = 1;
		}

		this.lastWordTime = time;
		this.lastWord = word;

		if(isCombo){
			this.b_combos++;
			this.streak++;

			// update stats
			this.b_maxstreak = Math.max(this.b_maxstreak, this.streak);
			this.b_maxmultiplier = Math.max(this.b_maxmultiplier, this.multiplier);
		}else{
			this.streak = 0;
		}

		return isCombo;
	}

	update(){
		// Use a word of length 10 to decrease the multiplier
		if(!this.insideHoldTreshold("0123456789")){
			this.lastWordTime = this.getCurrentTime();
			this.multiplier = 1;
		}
	}

	insideTreshold(word){
		var time = this.getCurrentTime();
		var period = time - this.lastWordTime;
		// Time available to write the word
		var treshold = this.COMBO_TRESHOLD * word.length;

		return period < treshold;
	}

	insideHoldTreshold(word){
		var time = this.getCurrentTime();
		var period = time - this.lastWordTime;
		// Time available to write the word
		var holdTreshold = this.COMBO_HOLD_TRESHOLD * word.length;

		return period < holdTreshold;
	}

	getMultiplier(){
		return this.multiplier;
	}

	getMaxCombo(){
		return this.MAX_MULTIPLIER;
	}

	getCurrentTime(){
		return new Date().getTime();
	}

	getSteak(){
		return this.streak;
	}

	getData(){
		return {
			combos: this.b_combos,
			maxmultiplier: this.b_maxmultiplier,
			maxstreak: this.b_maxstreak
		};
	}
}

class LifeManager {
	constructor(startLifeCount, lifecap){
		this.lifecount = startLifeCount;
		// max amount of lifes you can have
		this.LIFE_CAP = lifecap;
		// Generate a new life everytime x amount of streaks
		this.STREAK_INTERVAL = 5;

		this.lastStreak = -1;
	}

	getLifeCount(){
		return this.lifecount;
	}

	updateStreak(streak){
		if(streak !== this.lastStreak){
			this.lastStreak = streak;

			if(streak >= this.STREAK_INTERVAL && streak % this.STREAK_INTERVAL == 0){
				this.generateLife();
			}
		}
	}

	generateLife(count = 1){
		this.lifecount = Math.min(this.lifecount + count, this.LIFE_CAP);
	}

	consumeLife(count = 1){
		this.lifecount = Math.max(0, this.lifecount - count);
	}
}

class Game extends BaseView {

	constructor(app, game){
		super(app, game);

		//set width and height variables for game
		this.width = app.width;
		this.height = app.height;
		//create game object and initialize the canvas
		this.comboManager = new ComboManager();
		this.lifeManager  = new LifeManager(3, 9);

		//initialize some variables
		this.play = null;
		this.food = null;
		this.cursors = null;
		this.speed = 175;
		this.score = 0;
		this.scoreText = null;
		this.distance = 0;
		this.targetDistance = 25;
		this.nextAsteroidTime = null;
		this.wordsBuffer = [];

		this.dictData = null;
		this.levelData = null;
		this.currentLevel = 0;

		this.textInput = null;

		this.exhaustCount = 50;
		this.exhaustDelay = 1000;

		// bookkeeping
		this.b_wordcount = 0;
		this.b_lettercount = 0;
	}

	loadLevel(levelIndex){
		this.currentLevel = levelIndex;
	}


	preload() {
		// Load the sprites
		this.game.load.atlasXML('space_atlas', 'asset/sprites/space_atlas.png', 'asset/sprites/space_atlas.xml');
	    this.game.load.image('background', 'asset/backgrounds/darkPurple.png');
	    this.game.load.text('dictionary', 'asset/data/dictionary.txt');
	    this.game.load.text('levels', 'asset/data/levels.json');
	}

	create() {
		//start arcade physics engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		//initialize keyboard arrows for the game controls
		this.cursors = this.game.input.keyboard.createCursorKeys();
		var keys = [Phaser.KeyCode.SPACEBAR];
		this.phaserKeys = this.game.input.keyboard.addKeys(keys);
		this.game.input.keyboard.addKeyCapture(keys);
		//game.input.keyboard.addCallbacks(this, null, null, onKeyPress);

		//add background tiles
		this.starfield = this.game.add.tileSprite(0, 0, this.width, this.height, 'background');
		this.dictData  = this.getDictionary();
		this.levelData = this.getLevels();
		this.targetDistance = this.currentLevelData().distance;

		// Create ammunition
		this.lasers = this.game.add.group();
	    this.lasers.enableBody = true;
	    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;

	    this.lasers.createMultiple(20, 'space_atlas', 'laserBlue01.png');
	    this.lasers.setAll('checkWorldBounds', true);
	    this.lasers.setAll('outOfBoundsKill', true);
	    this.lasers.setAll('anchor', new Phaser.Point(0.5, 1));
	    this.lasers.setAll('tracking', true);

	    // Create asteroid collision objects
		this.asteroids = this.game.add.group();
	    this.asteroids.enableBody = true;
	    this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;
	    this.game.physics.enable(this.asteroids, Phaser.Physics.ARCADE);

	    this.asteroids.createMultiple(20, 'space_atlas', 'meteorGrey_big1.png');
	    this.asteroids.setAll('checkWorldBounds', true);
	    this.asteroids.setAll('outOfBoundsKill', true);
	    this.asteroids.setAll('allowRotation', true);
	    this.asteroids.setAll('anchor', new Phaser.Point(0.5, 0.5));
	    this.asteroids.setAll('body.bounce', new Phaser.Point(0.1, 0.1));

	    // create explosion emitter
	    this.emitter = this.game.add.emitter(0, 0, 100);
	  	this.emitter.makeParticles('space_atlas', 'meteorGrey_tiny1.png');
	    this.emitter.gravity = 20;

	    // create exhaust emitter
	    this.exhaustEmitters = this.add.group();
	    for(var i = 0; i < this.exhaustCount; i++)
	    	this.exhaustEmitters.add(this.game.add.emitter(0, 0, 1));
	    this.exhaustEmitters.setAll("gravity", -10);
	    this.exhaustEmitters.forEach(l => {
	    	l.makeParticles("space_atlas", "meteorGrey_tiny1.png")

		    l.minParticleSpeed.set(-30, 80);
	  		l.maxParticleSpeed.set(30, 100);
	    });

		//add player sprite
		this.player = this.game.add.sprite(this.width*0.5, this.height*0.8, 'space_atlas', 'playerShip1_red.png');
		this.player.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = false;

		//place score text on the screen
		this.scoreText = this.game.add.text(10, 15, this.score, { font: "20px Arial Black", fill: "#eeeeee" });
	 	
	 	//Used when we're doing handwriting
		this.textInput = document.getElementById("textInput");
		this.textLog = document.getElementById("textLog");

		// Create sprites for the combo bar
		this.comboBar = [];
		var maxcombo = this.comboManager.getMaxCombo();
		for(var i = 0; i < maxcombo; i++){
			var spr = this.game.add.sprite(this.width-10*(maxcombo - i - 1) - 10, this.height - 10, 'space_atlas', 'laserGreen05.png');
			spr.anchor.set(1, 1);
			var mask = 0xff0000;
			var fadeStart = 0x002222;
			var fadeEnd   = 0x00ffff;

			var fade = parseInt((fadeEnd - fadeStart) * (1.0 * (i) / (maxcombo-1)) + fadeStart);
			spr.tint = mask | fade;

			this.comboBar.push(spr);
		}

		this.distanceBar = this.game.add.graphics(0, 0);
		this.distanceBar.beginFill(0x00ff00);
		this.distanceBar.drawRect(0, 0, this.width, 2);
		this.distanceBar.endFill();

		this.distanceBar.scale.x = 0;
		this.distanceBar.alpha = .7;

		this.createLives();
	}

	update() {	
		if(this.distance >= this.targetDistance){
			this.app.levelCompleted(this.getData());
			return;
		}
		else if(this.lifeManager.getLifeCount() == 0){
			this.app.levelFailed(this.getData());
			return;
		}

		this.distanceBar.scale.x = 1.0 * this.distance / this.targetDistance;

		// first, draw the moving background and the health indicators...
		this.starfield.tilePosition.x = 0.5;
		this.starfield.tilePosition.y += 2 * this.comboManager.getMultiplier();

		//game.physics.arcade.collide(asteroids, asteroids);
		this.game.physics.arcade.overlap(this.asteroids, this.lasers, this.shootAsteroid, null, this);

		//move the player up and down based on keyboard arrows
		if (this.cursors.up.isDown) {
			this.player.body.velocity.y = -this.speed;
		}
		else if (this.cursors.down.isDown) {
			this.player.body.velocity.y = this.speed;
		}
		else {
			this.player.body.velocity.y = 0;
		}

		//move the player right and left based on keyboard arrows
		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -this.speed;
		}
		else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = this.speed;
		}
		else {
			this.player.body.velocity.x = 0;
		}

		for (var index in this.phaserKeys) {
			// Save a reference to the current key
			var key = this.phaserKeys[index];
			// If the key was just pressed, fire a laser
			if (key.justDown) {
				this.fireLaser();
			}
		}

		//spawn new enemies as needed
		if (this.moreAsteroidsNeeded())
			this.spawnAsteroid();

		var matchedWord = false;
		var sortedAsteroids = [];
		this.asteroids.forEachAlive(a => sortedAsteroids.push(a), this);

		// Destroy astroids in y-order, if 2 identical astroids are present
		// the one closest to destruction will be removed first
		sortedAsteroids
			.sort((a, b) => b.y - a.y)
			.forEach(this.cb(function(asteroid){
				// Check if there is a match
				var matches = this.wordsBuffer.filter(w => w === asteroid.label);
				// update the current combo
				if (matches.length > 0) 
					this.comboManager.foundWord(matches[0]);

				// update/destroy astroid, score will now use the correct combo
				// as it is updated in the previous line
				this.updateAsteroid(asteroid);

				if(matches.length > 0 && !matchedWord){
					matchedWord = true;
					// clear the buffer, duplicates are not cleared at once
					this.wordsBuffer = [];
				}
			}));

		this.lifeManager.updateStreak(this.comboManager.getSteak());

		// Check if a combo has run out
		this.comboManager.update();

		this.updateComboBar();
		this.updateLives();
	}

	updateComboBar(){
		this.comboBar.forEach(this.cb(function(c, i){
			if(i < this.comboManager.getMultiplier()){
				c.alpha = 1;
			}else{
				c.alpha = .4;
			}
		}));

		// Update the exhaust
		var interval = this.comboManager.getMaxCombo() - this.comboManager.getMultiplier() + 1;
		for(var i = 0; i < this.exhaustEmitters.children.length; i++){
			var e = this.exhaustEmitters.children[i];
			e.forEachAlive(function(p){
				p.alpha = p.lifespan / e.lifespan;
				p.tint  = 0xffdc51;

				if(i % interval != 0) p.alpha = 0;
			})
		}

	    this.exhaustEmitters.setAll("x", this.player.x);
	    this.exhaustEmitters.setAll("y", this.player.y + this.player.height/2);

	    for(var i = 0; i < this.exhaustEmitters.length; i++){
	    	var e = this.exhaustEmitters.children[i];
	    	setTimeout((function(e, t){
	    		return function(){
					e.start(true, t.exhaustDelay, null, 1);
				};
		    })(e, this), this.exhaustDelay / this.exhaustCount * i);
	    }
	}

	processKeyPress (event) {
		var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
	    
		if (chCode == 13) { /* CR */
			var para = document.createElement("p");
			var t = document.createTextNode(textInput.value);
			para.appendChild(t);
			this.textLog.appendChild(para); 

			this.wordsBuffer = [];
			this.textInput.value = '';
			return true;
		} 
	}

	onHandwriteResult(words){
		this.wordsBuffer = words;
	}

	fireLaser(target = null) {
		// Get the first laser that's inactive, by passing 'false' as a parameter
		var laser = this.lasers.getFirstExists(false);
		if (laser) {
			// If we have a laser, set it to the starting position
			laser.reset(this.player.x, this.player.y - 50);
			// Give it a velocity of -500 so it starts shooting
			if (target) {
				this.rot = this.game.physics.arcade.angleBetween(target, this.player) - 3.14/2;
				this.Xvector = (target.x - this.player.x) * 1;
	    		this.Yvector = (target.y + 10 - this.player.y) * 1;

				this.game.add.tween(this.laser).to( { x: target.x, y: target.y, rotation: this.rot }, 750, Phaser.Easing.Linear.None, true);
			}
			else {
				laser.rotation = 0;
				laser.body.velocity.setTo(0, -500);
			}
		}
	}

	updateAsteroid(asteroid) {
		var matchedWord = null;

		if (asteroid.y > this.height) {
			this.destroyAsteroid(asteroid, -asteroid.label.length); // loose
			this.lifeManager.consumeLife();
			// TODO: penalize the user?
		}
		if (asteroid && asteroid.text && asteroid.label) {
			var matches = this.wordsBuffer.filter(w => w === asteroid.label);
			if (matches.length > 0) {
				matchedWord = matches[0];

				this.destroyAsteroid(asteroid, asteroid.label.length); // win
				// Clear the handwriting input
				this.app.clearHandwriting();
				this.showWordOverlay(matches[0] + " +" + (this.comboManager.getMultiplier() * matchedWord.length));
			}
			asteroid.text.x = asteroid.x;
			asteroid.text.y = asteroid.y - asteroid.height/2 - 10;
		}

		return matchedWord;
	}

	moreAsteroidsNeeded() {
		// no more than three asteroids at a time

		if (this.asteroids.countLiving() >= this.currentLevelData().maxenemies) return false;

		// wait a minimum amount of time
		if (this.nextAsteroidTime > this.game.time.totalElapsedSeconds()) return false;

		if (this.game.rnd.frac() > 0.7) {
			this.nextAsteroidTime = this.game.time.totalElapsedSeconds() + 2;
			return true;
		}
		return false;
	}

	currentLevelData() {
		if (this.currentLevel > this.levelData.length)
			return this.levelData[this.levelData.length - 1];
		else	
			return this.levelData[this.currentLevel];
	}

	spawnAsteroid() {
		// Get the first asteroid that's inactive, by passing 'false' as a parameter
		var asteroid = this.asteroids.getFirstExists(false);
		if (!asteroid) return null;

		// Set the asteroid's physical properties
		var halfwit = asteroid.width / 2; // pun intended
		var xpos = this.game.rnd.integerInRange(halfwit , this.width - halfwit);
		var v = this.game.rnd.integerInRange(5, 50)
		var av = this.game.rnd.integerInRange(-25, 25)

		asteroid.reset(xpos, asteroid.height/2);
		asteroid.body.velocity.y = v;
		asteroid.body.angularVelocity = av;

		// Give the asteroid a label
		var idx = this.game.rnd.integerInRange(this.currentLevelData().fromdict, this.currentLevelData().todict) - 1;
		if ((idx >= 0) && (idx < this.dictData.length))
			asteroid.label = this.dictData[idx].trim().toLowerCase();
		else
			asteroid.label = "label";
		asteroid.text = this.game.add.text(0, 0, asteroid.label, Theme.Text.Asteroid);
		asteroid.text.anchor.set(0.5, -.5);
	}

	shootAsteroid(enemy, laser) {
		if (laser) laser.kill();
		this.destroyAsteroid(enemy, -1);	
	}

	destroyAsteroid(enemy, delta = 0) {
		this.score += delta; 
		this.scoreText.text = this.score;

		// increase the distance when positive
		if(delta > 0){
			this.distance += delta * this.comboManager.getMultiplier();
			this.b_wordcount += 1;
			this.b_lettercount += delta;
		}

		if (enemy.text) {
			enemy.text.destroy();
			enemy.label = '';
		}

		this.emitter.x = enemy.x;
	    this.emitter.y = enemy.y;
		enemy.kill();

	    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
	    //  The second gives each particle a 2000ms lifespan
	    //  The third is ignored when using burst/explode mode
	    //  The final parameter (10) is how many particles will be emitted in this single burst
	    this.emitter.start(true, 2000, null, 10);
	}

	showWordOverlay(text){
		// Text overlay when a word is matched
		var wordOverlayText = this.game.add.text(0, 0, text, Theme.Text.TitleGiant);
		wordOverlayText.setTextBounds(0, 0, this.width, this.height);

		wordOverlayText.alpha = .5;
    	this.game.add.tween(wordOverlayText).to( { alpha: 0, y: -this.height/4 }, 1000, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
    		wordOverlayText.destroy();
    	}, this);
  	}

  	createLives(){
  		var maxLives = this.lifeManager.LIFE_CAP;
  		var spriteName = "playerLife1_red.png";
  		var padding = this.width*.02;
  		var scale = .75;

  		this.lives = [];
  		for(var i = 0; i < maxLives; i++){
  			var l = this.game.add.sprite(padding, this.height - padding, "space_atlas", spriteName);
  			l.y -= (l.height + padding) * i * scale;
  			l.anchor.set(0, 1);
  			l.scale.set(scale);
  			this.lives.push(l);
  		}
  	}

  	updateLives(){
  		this.lives.forEach(this.cb(function(l, i){
  			l.alpha = i < this.lifeManager.getLifeCount() ? 1 : 0;
  		}));
  	}

  	getData(){
  		return {
  			combo: this.comboManager.getData(),
  			level: this.currentLevel,
  			wordcount: this.b_wordcount,
  			lettercount: this.b_lettercount
  		};
  	}

	destroy(){
		this.game.destroy();
	}

	cb(fun){
		return ownedCallback(this, fun);
	}
}


/*

function writeListener (e) {
    if (e.detail && e.detail.type == 'textResult') {
        var candidates = e.detail.getDocument().getTextSegment().getCandidates();
        candidates.forEach(function(c){
            console.log(c.getLabel() + '(' + c.getNormalizedScore() + ')');
            onKeyPress(c.getLabel());
        });
    }

}

function onKeyPress(key) {
	console.log(key);
	food.forEach(function(b) {
		key = key.toUpperCase();
		if (b.label.startsWith(key)) {
			b.label = b.label.substring(1);
			b.text.kill();

			textInput.clear();

			if (b.label.length == 0) {
				eatFood(b);
				return;
			}
			b.text = game.add.text(0, 0, b.label, style);
    		b.text.anchor.set(0.5);
		}
	}, this, true);
}

function drawFood(b) {
	b.text.x = b.x;
    b.text.y = b.y - b.text.height - 10;
}
//eatFood function
function eatFood(food) {
	//update the score
	score += food.value;
	scoreText.text = score;

	//remove the piece of food
	food.kill();
}

function createBlock(food, label, xpos) {
	b = food.create(xpos, 60, 'food');
	
	b.anchor.set(0.5);
	b.body.collideWorldBounds = true;

	b.label = label;
	b.value = label.length;
	b.text = game.add.text(0, 0, b.label, style);
    b.text.anchor.set(0.5);
	
	return b;
}

*/