class Game {

	constructor(app, game){
		this.app = app;

		//set width and height variables for game
		this.width = 480;
		this.height = 800;
		//create game object and initialize the canvas
		this.game = game;

		this.style = { font: "16px Arial", fill: "#ff0044", wordWrap: false, wordWrapWidth: 100, align: "center", backgroundColor: "#ffffff" };

		//initialize some variables
		this.play = null;
		this.food = null;
		this.cursors = null;
		this.speed = 175;
		this.score = 0;
		this.scoreText = null;
		this.nextAsteroidTime = null;
		this.wordsBuffer = [];

		this.dictData = null;
		this.levelData = null;
		this.currentLevel = 1;
		this.levelToLoad = null;

		this.textInput = null;
	}

	loadLevel(level){
		this.levelToLoad = level;
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
		this.dictData = this.game.cache.getText('dictionary').split('\n');
		this.levelData = JSON.parse(this.game.cache.getText('levels')).levels;
		if(this.levelToLoad !== null){
			console.log(this.levelData.indexOf(this.levelToLoad));
		}


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

		//add player sprite
		this.player = this.game.add.sprite(this.width*0.5, this.height*0.9, 'space_atlas', 'playerShip1_red.png');
		this.player.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = false;

		//place score text on the screen
		this.scoreText = this.game.add.text(10, 15, this.score, { font: "20px Arial Black", fill: "#eeeeee" });
	 	
	 	//Used when we're doing handwriting
		this.textInput = document.getElementById("textInput");
		this.textLog = document.getElementById("textLog");
	}

	update() {	
		// first, draw the moving background and the health indicators...
		this.starfield.tilePosition.x = 0.5;
		this.starfield.tilePosition.y += 2;

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

		this.asteroids.forEachAlive(this.updateAsteroid, this);
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
		if (asteroid.y > this.height) {
			this.destroyAsteroid(asteroid, -asteroid.label.length); // loose
			// TODO: penalize the user?
		}
		if (asteroid && asteroid.text && asteroid.label) {
			var matches = this.wordsBuffer.filter(w => w === asteroid.label);
			if (matches.length > 0) {
				this.destroyAsteroid(asteroid, asteroid.label.length); // win
				// Clear the handwriting input
				this.app.clearHandwriting();
				this.showWordOverlay(matches[0])
			}
			asteroid.text.x = asteroid.x;
			asteroid.text.y = asteroid.y - asteroid.height/2 - 10;
		}
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
		// Get the first laser that's inactive, by passing 'false' as a parameter
		var asteroid = this.asteroids.getFirstExists(false);
		if (!asteroid) return null;

		// Set the asteroid's physical properties
		var halfwit = asteroid.width / 2; // pun intended
		var xpos = this.game.rnd.integerInRange(halfwit , this.width - halfwit);
		var v = this.game.rnd.integerInRange(5, 50)
		var av = this.game.rnd.integerInRange(-25, 25)

		asteroid.reset(xpos, -asteroid.height/2);
		asteroid.body.velocity.y = v;
		asteroid.body.angularVelocity = av;

		// Give the asteroid a label
		var idx = this.game.rnd.integerInRange(this.currentLevelData().fromdict, this.currentLevelData().todict) - 1;
		if ((idx >= 0) && (idx < this.dictData.length))
			asteroid.label = this.dictData[idx].trim().toLowerCase();
		else
			asteroid.label = "label";
		asteroid.text = this.game.add.text(0, 0, asteroid.label, { font: "16px Arial", fill: "#c7d0dd" });
		asteroid.text.anchor.set(0.5, 1);
	}

	shootAsteroid(enemy, laser) {
		if (laser) laser.kill();
		this.destroyAsteroid(enemy, -1);	
	}

	destroyAsteroid(enemy, delta = 0) {
		this.score += delta; 
		this.scoreText.text = this.score;

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
		var wordOverlayText = this.game.add.text(0, 0, text, { font: "50px Arial", fill: "#eeeeee", boundsAlignH: "center", boundsAlignV: "middle" });
		wordOverlayText.setTextBounds(0, 0, this.width, this.height);

		wordOverlayText.alpha = .5;
    	this.game.add.tween(wordOverlayText).to( { alpha: 0, y: -this.height/4 }, 1000, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
    		wordOverlayText.destroy();
    	}, this);
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