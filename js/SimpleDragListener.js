class SimpleDragListener {
	constructor(game){
		this.game = game;
		this.dragUpdated = false;
		this.beenDown = false;
		this.click = true;
		this.clickableItems = [];

		this.y = 0;
		this.baseDraggedY = 0;
		this.x = 0;
		this.baseDraggedX = 0;

		this.setLowerBounds(-SimpleDragListener.INFINITE, 
			-SimpleDragListener.INFINITE);
		this.setUpperBounds(SimpleDragListener.INFINITE,  
			SimpleDragListener.INFINITE);

		this.onClick = this._onClick;
	}

	setLowerBounds(x, y){
		this.lowerBoundX = x;
		this.lowerBoundY = y;
	}

	setUpperBounds(x, y){
		this.upperBoundX = x;
		this.upperBoundY = y;
	}

	registerClick(element, action){
		this.clickableItems.push({ "element": element, "action": action });
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

			var distance = Math.sqrt(draggedExtraX*draggedExtraX + draggedExtraY*draggedExtraY);
			if(distance > SimpleDragListener.CLICK_DISTANCE){
				this.click = false;
			}
		}
		else if(!this.dragUpdated && this.beenDown){
			this.dragUpdated = true;

			this.baseDraggedY += pos.positionUp.y - pos.positionDown.y;
			this.baseDraggedY = this._normalizeY(this.baseDraggedY);

			this.baseDraggedX += pos.positionUp.x - pos.positionDown.x;
			this.baseDraggedX = this._normalizeX(this.baseDraggedX);

			// Send a "click" event if the distance traveled stayed below
			// the CLICK_DISTANCE value during the dragging
			if(this.click){
				this.onClick(pos.positionUp.x, pos.positionUp.y);
			}
			this.click = true;
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

	_onClick(x, y){
		var candidates = this.clickableItems.filter(i => i.element.getBounds().contains(x, y));
		if(candidates.length > 0) candidates[0].action();
	}
}

SimpleDragListener.INFINITE = Infinity;
SimpleDragListener.CLICK_DISTANCE = 25;