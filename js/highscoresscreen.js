class HighscoresScreen extends BaseView {
	constructor(app, context){
		super(app, context);

		this.headerHeight = this.height / 7.5;
		this.rowHeight = this.height / 15;
		this.padding = this.width * .05;

		this.dragListener = new SimpleDragListener(this.game);
		this.dragListener.setLowerBounds(0, -SimpleDragListener.INFINITE);
		this.dragListener.setUpperBounds(0, 0);

		this.scrollables = [];
		this.lastScroll = 0;
		this.textRow = null;
	}

	create(){
		super.create();

		var titleHeight = this.height / 10;
		var title = this.game.add.text(0, 0, this.translate.get("MenuMainHighscores"), Theme.Text.TitleLarge);
		title.setTextBounds(0, 0, this.width, titleHeight);

		this.mask = this.game.add.graphics(0, 0);
		this.mask.beginFill(0);
		this.mask.drawRect(0, titleHeight, this.width, this.height);
		this.mask.endFill();

		var levels = this.getLevels();
		var offset = titleHeight;
		for(var i = 0; i < levels.length; i++){
			var l = levels[i];
			if(l.checkpoint){
				this.insertHeaderRow(l, offset);
				offset += this.headerHeight;
			}else{
				this.insertLevelRow(l, offset, i);
				offset += this.rowHeight;
			}
		}
	}

	update(){
		super.update();

		this.dragListener.update();

		var offset = this.dragListener.y;
		if(offset != this.lastScroll){
			this.lastScroll = offset;
			this.scrollables.forEach(this.cb(function(s){
				var newPos = offset + s.startPos.y;
				s.y = newPos;
			}));
		}
	}

	getLevels(){
		var levels = super.getLevels();

		var starCount = 0;
		var totalCount = 0;
		var lastCheckpoint = null;

		for(var i = 0; i < levels.length; i++){
			var l = levels[i];
			if(l.checkpoint){
				if(lastCheckpoint != null){
					lastCheckpoint["starcount"] = starCount;
					lastCheckpoint["totalcount"] = totalCount;
				}

				lastCheckpoint = l;
				starCount = 0;
				totalCount = 0;
			}else{
				starCount += this.app.state.getLevelData(i).starcount;
				totalCount += 3;
			}
		}		

		if(lastCheckpoint != null){
			lastCheckpoint["starcount"] = starCount;
			lastCheckpoint["totalcount"] = totalCount;
		}

		return levels;
	}

	insertHeaderRow(levelObject, offset){
		var textStyle = Theme.Text.TitleMedium.Builder().centeredHorizontal(false).build();

		var row = this.game.add.text(0, offset, this.translate.get(levelObject.name), textStyle);
		row.setTextBounds(this.padding, 0, this.width - 2*this.padding, this.headerHeight);
		row.mask = this.mask;

		var stars = this.game.add.text(0, offset, levelObject.starcount + " / " + levelObject.totalcount, textStyle);
		stars.setTextBounds(this.width - this.padding, 0, this.width - 2*this.padding, this.headerHeight);
		stars.anchor.set(1, 0);
		stars.mask = this.mask;

		this.registerScrollElement(row);
		this.registerScrollElement(stars);

		if(this.textRow != null){
			this.textRow.text += "\n\n";
			this.textRow.textBounds.height += 2*this.rowHeight;
		}
	}

	insertLevelRow(levelObject, offset, index){
		// We only use a single text object for all the levels
		// otherwise scrolling becomes extremely laggy
		if(this.textRow == null){
			this.textRow = this.game.add.text(0, offset, "", Theme.Text.SubTitleMedium.Builder().centeredHorizontal(false).build());
			this.textRow.setTextBounds(this.padding, 0, this.width - 2*this.padding, 0);
			// this.textRow.mask = this.mask;

			this.registerScrollElement(this.textRow);

			// Set the lineSpacing so the rowHeight is completely filled up
			this.textRow.lineSpacing = this.rowHeight - this.textRow.height;
			// There will always be an extra new line => need to start off with rowHeight instead of 0
			this.textRow.textBounds.height = this.rowHeight;
			// Add the linespacing offset to correctly align the text
			this.textRow.y += this.textRow.lineSpacing/2;
		}

		// Append to the existing text element
		this.textRow.text += this.translate.get(levelObject.name) + "\n";
		// Increase the height of the bounds to correctly align
		this.textRow.textBounds.height += this.rowHeight;

		// Draw the gained star
		var starcount = this.app.state.getLevelData(index).starcount;
		if(starcount > 0){	
			var starSprite = this.createStarSprite(starcount);
			starSprite.x = this.width - this.padding;
			starSprite.y = offset + this.rowHeight/2;
			starSprite.anchor.set(1, .5);
			starSprite.mask = this.mask;

			this.registerScrollElement(starSprite);
		}
	}

	registerScrollElement(ele){
		ele.startPos = {
			x: ele.x,
			y: ele.y
		};
		this.scrollables.push(ele);
	}

	createStarSprite(count){
		if(count > 0){
			return this.game.add.sprite(0, 0, "space_atlas", [null, 'star_bronze.png', 'star_silver.png', 'star_gold.png'][count]);
		}
	}
}