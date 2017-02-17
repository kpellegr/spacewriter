class SimpleDragListener {
	constructor(game){
		this.game = game;
		this.dragUpdated = false;
		this.beenDown = false;

		this.y = 0;
		this.baseDraggedY = 0;
		this.x = 0;
		this.baseDraggedX = 0;

		this.setLowerBounds(-SimpleDragListener.INFINITE, 
			-SimpleDragListener.INFINITE);
		this.setUpperBounds(SimpleDragListener.INFINITE,  
			SimpleDragListener.INFINITE);
	}

	setLowerBounds(x, y){
		this.lowerBoundX = x;
		this.lowerBoundY = y;
	}

	setUpperBounds(x, y){
		this.upperBoundX = x;
		this.upperBoundY = y;
	}

	update(){
		var pos = this.game.input.activePointer;

		if(pos.isDown){
			this.beenDown = true;
			this.dragUpdated = false;

			var draggedExtraY = pos.position.y - pos.positionDown.y;
			var draggedExtraX = pos.position.x - pos.positionDown.x;
			this.y = this._normalizeY(this.baseDraggedY + draggedExtraY);
			this.x = this._normalizeX(this.baseDraggedX + draggedExtraX);
		}
		else if(!this.dragUpdated && this.beenDown){
			this.dragUpdated = true;

			this.baseDraggedY += pos.positionUp.y - pos.positionDown.y;
			this.baseDraggedY = this._normalizeY(this.baseDraggedY);

			this.baseDraggedX += pos.positionUp.x - pos.positionDown.x;
			this.baseDraggedX = this._normalizeX(this.baseDraggedX);
		}
	}

	_normalizeY(y){
		return this._normalize(y, this.upperBoundY, this.lowerBoundY);
	}

	_normalizeX(x){
		return this._normalize(x, this.upperBoundX, this.lowerBoundX);
	}

	_normalize(value, upper, lower){
		return Math.min(upper, Math.max(lower, value));
	}
}

SimpleDragListener.INFINITE = Infinity;