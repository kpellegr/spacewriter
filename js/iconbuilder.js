class IconBuilder {
	constructor(game, spritename){
		this.game = game;
		this.name = spritename;

		this.setPosition(0, 0)
			.setScale(1)
			.setSize(-1)
			.setTint(0xffffff);
	}

	setPosition(x, y){
		this.x = x;
		this.y = y;
		return this;
	}

	setX(x){
		this.x = x;
		return this;
	}

	setY(y){
		this.y = y;
		return this;
	}

	setScale(scale){
		this.scale = scale;
		return this;
	}

	setSize(size){
		this.size = size;
		return this;
	}

	setTint(tint){
		this.tint = tint;
		return this;
	}

	setOnClick(callback){
		this.clickenabled = true;
		this.clickcallback = callback;
		return this;
	}

	build(){
		var sprite = this.game.add.sprite(this.x, this.y, "icon_atlas", this.name);

		if(this.size < 0) this.size = sprite.width;
		var scaledSize = this.size * this.scale;
		var padding = (this.size - scaledSize) / 2.0;

		sprite.scale.set(this.scale);
		sprite.x += padding;
		sprite.y += padding;
		sprite.tint = this.tint;

		if(this.clickenabled){
			var background = this.game.add.graphics(this.x, this.y);
			background.beginFill(0);
			background.drawRect(0, 0, this.size, this.size);
			background.endFill();
			background.inputEnabled = true;
			background.events.onInputDown.add(this.clickcallback, this);
			background.alpha = 0;
		}

		return sprite;
	}
}