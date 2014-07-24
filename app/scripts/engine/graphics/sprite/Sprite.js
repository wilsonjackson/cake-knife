Engine.module('graphics.sprite.Sprite',
	[
		'math.Vector'
	],
	function (Vector) {
		'use strict';

		function Sprite() {
		}

		Sprite.prototype.init = function (image, x, y, w, h, margins) {
			this.image = image;
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.margins = margins || [0, 0, 0, 0];
		};

		//noinspection JSUnusedGlobalSymbols
		Sprite.prototype.getSize = function () {
			return new Vector(this.w, this.h);
		};

		//noinspection JSUnusedGlobalSymbols
		Sprite.prototype.getHitbox = function () {
			return new Vector(this.w - this.margins[1] - this.margins[3], this.h - this.margins[0] - this.margins[2]);
		};

		Sprite.prototype.clear = function (context, x, y) {
			context.clearRect(x - this.margins[3], y - this.h + this.margins[2], this.w, this.h);
		};

		Sprite.prototype.draw = function (context, x, y) {
			// Draw image from bottom left corner
			context.drawImage(this.image,
				this.x, this.y, // source position
				this.w, this.h, // source size
				x - this.margins[3],
				y - this.h + this.margins[2],
				this.w, this.h);
		};

		Sprite.prototype.toString = function () {
			return 'Sprite(src=' + this.image.src + ', x=' + this.x + ', y=' + this.y + ', w=' + this.w + ', h=' + this.h + ')';
		};

		return Sprite;
	});
