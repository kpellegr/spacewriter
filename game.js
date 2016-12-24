//set width and height variables for game
var width = 480;
var height = 800;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, "gamecanvas", {preload: preload, create: create, update: update});

var style = { font: "16px Arial", fill: "#ff0044", wordWrap: false, wordWrapWidth: 100, align: "center", backgroundColor: "#ffffff" };

//initialize some variables
var play;
var food;
var cursors;
var speed = 175;
var score = 0;
var scoreText;
var nextAsteroidTime;
var textBuffer = '';

var dictData;
var levelData;
var currentLevel = 1;

var textInput;

function preload() {
	// Load the sprites
	game.load.atlasXML('space_atlas', 'asset/sprites/space_atlas.png', 'asset/sprites/space_atlas.xml');
    game.load.image('background', 'asset/backgrounds/darkPurple.png');
    game.load.text('dictionary', 'asset/data/dictionary.txt');
    game.load.text('levels', 'asset/data/levels.json');
}

function create() {
	//start arcade physics engine
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 0;

	//initialize keyboard arrows for the game controls
	cursors = game.input.keyboard.createCursorKeys();
	var keys = [Phaser.KeyCode.SPACEBAR];
	phaserKeys = game.input.keyboard.addKeys(keys);
	game.input.keyboard.addKeyCapture(keys);
	//game.input.keyboard.addCallbacks(this, null, null, onKeyPress);

	//add background tiles
	starfield = game.add.tileSprite(0, 0, width, height, 'background');
	dictData = game.cache.getText('dictionary').split('\n');
	levelData = JSON.parse(game.cache.getText('levels')).levels;


	// Create ammunition
	lasers = game.add.group();
    lasers.enableBody = true;
    lasers.physicsBodyType = Phaser.Physics.ARCADE;

    lasers.createMultiple(20, 'space_atlas', 'laserBlue01.png');
    lasers.setAll('checkWorldBounds', true);
    lasers.setAll('outOfBoundsKill', true);
    lasers.setAll('anchor', new Phaser.Point(0.5, 1));
    lasers.setAll('tracking', true);

    // Create asteroid collision objects
	asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;
    game.physics.enable(asteroids, Phaser.Physics.ARCADE);

    asteroids.createMultiple(20, 'space_atlas', 'meteorGrey_big1.png');
    asteroids.setAll('checkWorldBounds', true);
    asteroids.setAll('outOfBoundsKill', true);
    asteroids.setAll('allowRotation', true);
    asteroids.setAll('anchor', new Phaser.Point(0.5, 0.5));
    asteroids.setAll('body.bounce', new Phaser.Point(0.1, 0.1));

    // create explosion emitter
    emitter = game.add.emitter(0, 0, 100);
  	emitter.makeParticles('space_atlas', 'meteorGrey_tiny1.png');
    emitter.gravity = 20;

	//add player sprite
	player = game.add.sprite(width*0.5, height*0.9, 'space_atlas', 'playerShip1_red.png');
	player.anchor.set(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = false;

	//place score text on the screen
	scoreText = game.add.text(10, 15, score, { font: "20px Arial Black", fill: "#eeeeee" });
 	
 	//Used when we're doing handwriting
	textInput = document.getElementById("textInput");
	textLog = document.getElementById("textLog");
}

function update() {	
	// first, draw the moving background and the health indicators...
	starfield.tilePosition.x = 0.5;
	starfield.tilePosition.y += 2;

	//game.physics.arcade.collide(asteroids, asteroids);
	game.physics.arcade.overlap(asteroids, lasers, shootAsteroid, null, this);

	//move the player up and down based on keyboard arrows
	if (cursors.up.isDown) {
		player.body.velocity.y = -speed;
	}
	else if (cursors.down.isDown) {
		player.body.velocity.y = speed;
	}
	else {
		player.body.velocity.y = 0;
	}

	//move the player right and left based on keyboard arrows
	if (cursors.left.isDown) {
		player.body.velocity.x = -speed;
	}
	else if (cursors.right.isDown) {
		player.body.velocity.x = speed;
	}
	else {
		player.body.velocity.x = 0;
	}

	for (var index in phaserKeys) {
		// Save a reference to the current key
		var key = phaserKeys[index];
		// If the key was just pressed, fire a laser
		if (key.justDown) {
			fireLaser();
		}
	}

	//spawn new enemies as needed
	if (moreAsteroidsNeeded())
		spawnAsteroid();

	asteroids.forEachAlive(updateAsteroid, this);
}

function processKeyPress (event) {
	var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
    
	if (chCode == 13) { /* CR */
		var para = document.createElement("p");
		var t = document.createTextNode(textInput.value);
		para.appendChild(t);
		textLog.appendChild(para); 

		textBuffer = '';
		textInput.value = '';
		return true;
	} 
}

function processInput (text) {
	if (text) {
		textBuffer = text.trim().toLowerCase();
	}
	else {
		textBuffer = '';
	}
}

function fireLaser(target = null) {
	// Get the first laser that's inactive, by passing 'false' as a parameter
	var laser = lasers.getFirstExists(false);
	if (laser) {
		// If we have a laser, set it to the starting position
		laser.reset(player.x, player.y - 50);
		// Give it a velocity of -500 so it starts shooting
		if (target) {
			rot = game.physics.arcade.angleBetween(target, player) - 3.14/2;
			Xvector = (target.x - player.x) * 1;
    		Yvector = (target.y + 10 - player.y) * 1;

			game.add.tween(laser).to( { x: target.x, y: target.y, rotation: rot }, 750, Phaser.Easing.Linear.None, true);
		}
		else {
			laser.rotation = 0;
			laser.body.velocity.setTo(0, -500);
		}
	}
}

function updateAsteroid(asteroid) {
	if (asteroid.y > height) {
		destroyAsteroid(asteroid, -asteroid.label.length); // loose
		// TODO: penalize the user?
	}
	if (asteroid && asteroid.text && asteroid.label) {
		if (asteroid.label == textBuffer) {
			destroyAsteroid(asteroid, asteroid.label.length); // win
		}
		asteroid.text.x = asteroid.x;
		asteroid.text.y = asteroid.y - asteroid.height/2 - 10;
	}
}
function moreAsteroidsNeeded() {
	// no more than three asteroids at a time

	if (asteroids.countLiving() >= currentLevelData().maxenemies) return false;

	// wait a minimum amount of time
	if (nextAsteroidTime > this.game.time.totalElapsedSeconds()) return false;

	if (game.rnd.frac() > 0.7) {
		nextAsteroidTime = this.game.time.totalElapsedSeconds() + 2;
		return true;
	}
	return false;
}

function currentLevelData() {
	if (currentLevel > levelData.length)
		return levelData[levelData.length - 1];
	else	
		return levelData[currentLevel];
}

function spawnAsteroid() {
	// Get the first laser that's inactive, by passing 'false' as a parameter
	var asteroid = asteroids.getFirstExists(false);
	if (!asteroid) return null;

	// Set the asteroid's physical properties
	halfwit = asteroid.width / 2; // pun intended
	xpos = game.rnd.integerInRange(halfwit , width - halfwit);
	v = game.rnd.integerInRange(5, 50)
	av = game.rnd.integerInRange(-25, 25)

	asteroid.reset(xpos, -asteroid.height/2);
	asteroid.body.velocity.y = v;
	asteroid.body.angularVelocity = av;

	// Give the asteroid a label
	idx = game.rnd.integerInRange(currentLevelData().fromdict, currentLevelData().todict) - 1;
	if ((idx >= 0) && (idx < dictData.length))
		asteroid.label = dictData[idx].trim().toLowerCase();
	else
		asteroid.label = "label";
	asteroid.text = game.add.text(0, 0, asteroid.label, { font: "16px Arial", fill: "#c7d0dd" });
	asteroid.text.anchor.set(0.5, 1);
}

function shootAsteroid(enemy, laser) {
	if (laser) laser.kill();
	destroyAsteroid(enemy, -1);	
}
function destroyAsteroid(enemy, delta = 0) {
	score += delta; 
	scoreText.text = score;

	if (enemy.text) {
		enemy.text.destroy();
		enemy.label = '';
	}

	emitter.x = enemy.x;
    emitter.y = enemy.y;
	enemy.kill();

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    emitter.start(true, 2000, null, 10);
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