/*
	Class using the builder pattern to quickly construct
	a new text style.
*/
class TextStyleBuilder {
	constructor(){
		this.size(16)
			.centered(true)
			.font("Arial")
			.color("#cccccc")
			.wordWrap(false, null);
	}

	centered(centered){
		this._centeredH = centered;
		this._centeredV = centered;
		return this;
	}

	centeredHorizontal(centeredH){
		this._centeredH = centeredH;
		return this;
	}

	centeredVertical(centeredV){
		this._centeredV = centeredV;
		return this;
	}

	size(size){
		this._size = size;
		return this;
	}

	font(font){
		this._font = font;
		return this;
	}

	color(color){
		this._color = color;
		return this;
	}

	wordWrap(enable, width){
		this._wordWrap = enable;
		this._wordWrapWidth = width; 
		return this;
	}

	build(){
		var colorHex = this._color;
		if(typeof colorHex === typeof 1)
			colorHex = "#" + colorHex.toString(16);

		return {
			font: (this._size * Theme.getScale()) + "px " + this._font, 
			fill: colorHex, 
			boundsAlignH: this._centeredH ? "center" : null,
			boundsAlignV: this._centeredV ? "middle" : null,
			wordWrap: this._wordWrap, 
			wordWrapWidth: this._wordWrapWidth 
		};
	}
}

class Theme {}

Theme.getScale  = () => Theme._scale;
Theme.getHeight = () => Theme._width;
Theme.getWidth  = () => Theme._height;

Theme.init = function(width, height, gameContainer){
	Theme._width  = width;
	Theme._height = height;

	var wh = gameContainer.getBoundingClientRect().height;
	Theme._scale = wh / height;

	Theme._setup();
};

/*
	Init all "internal" classes inside a closure to
	simulate private access. They are only accessible
	through the Theme class.
*/
Theme._setup = function(){
	class Text {}
	Theme.Text = Text;
	class Color {}
	Theme.Color = Color;

	// colors
	Theme.Color.Background = 0x3A2E3F;
	Theme.Color.Title = 0xeeeeee;
	Theme.Color.SubTitle = 0xdddddd;
	Theme.Color.Text = 0xcccccc;
	Theme.Color.DialogBorder = 0xcccccc;
	Theme.Color.ButtonBorder = 0xcccccc;

	// Create the different text styles for title, subtitle and text
	function createTitleBuilder(){
		return new TextStyleBuilder()
			.color(Theme.Color.Title)
			.centered(true)
			.size(30);
	}
	var titleBuilder = createTitleBuilder();

	// #eeeeee
	Theme.Text.TitleGiant  = titleBuilder.size(50).build();
	Theme.Text.TitleLarge  = titleBuilder.size(30).build();
	Theme.Text.TitleMedium = titleBuilder.size(26).build();
	Theme.Text.TitleSmall  = titleBuilder.size(22).build();

	Theme.Text.TitleGiant.Builder  = createTitleBuilder;
	Theme.Text.TitleLarge.Builder  = createTitleBuilder;
	Theme.Text.TitleMedium.Builder = createTitleBuilder;
	Theme.Text.TitleSmall.Builder  = createTitleBuilder;

	function createSubtitleBuilder(){
		return new TextStyleBuilder()
			.color(Theme.Color.SubTitle)
			.centered(true)
			.size(24);
	} 
	var subTitleBuilder = createSubtitleBuilder();

	// #dddddd
	Theme.Text.SubTitleLarge  = subTitleBuilder.size(24).build();
	Theme.Text.SubTitleMedium = subTitleBuilder.size(21).build();
	Theme.Text.SubTitleSmall  = subTitleBuilder.size(18).build();

	Theme.Text.SubTitleLarge.Builder  = createSubtitleBuilder;
	Theme.Text.SubTitleMedium.Builder = createSubtitleBuilder;
	Theme.Text.SubTitleSmall.Builder  = createSubtitleBuilder;

	function createTextBuilder(){
		return new TextStyleBuilder()
			.color(Theme.Color.Text)
			.centered(false)
			.size(16);
	}
	var textBuilder = createTextBuilder();

	// #cccccc
	Theme.Text.Large  = textBuilder.size(16).build();
	Theme.Text.Medium = textBuilder.size(14).build();
	Theme.Text.Small  = textBuilder.size(12).build();

	Theme.Text.Large.Builder  = createTextBuilder;
	Theme.Text.Medium.Builder = createTextBuilder;
	Theme.Text.Small.Builder  = createTextBuilder;

	Theme.Text.Asteroid = new TextStyleBuilder()
		.color(0xffffff)
		.size(20)
		.centered(false)
	.build();
};

