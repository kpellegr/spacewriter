class SimpleDragListener {
	constructor(game){
		this.game = game;
		this.dragUpdated = false;

		this.y = 0;
		this.baseDraggedY = 0;
		this.x = 0;
		this.baseDraggedX = 0;
	}

	update(){
		var pos = this.game.input.mousePointer;

		if(pos.isDown){
			this.dragUpdated = false;

			var draggedExtraY = pos.position.y - pos.positionDown.y;
			var draggedExtraX = pos.position.x - pos.positionDown.x;
			this.y = this.baseDraggedY + draggedExtraY;
			this.x = this.baseDraggedX + draggedExtraX;
		}
		else if(!this.dragUpdated){
			this.dragUpdated = true;

			this.baseDraggedY += pos.positionUp.y - pos.positionDown.y;
			this.baseDraggedY = Math.max(0, this.baseDraggedY);

			this.baseDraggedX += pos.positionUp.x - pos.positionDown.x;
			this.baseDraggedX = Math.max(0, this.baseDraggedX);
		}
	}
}