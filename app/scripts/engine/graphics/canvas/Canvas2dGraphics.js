Engine.module('graphics.canvas.Canvas2dGraphics',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @param canvas
		 * @constructor
		 */
		function Canvas2dGraphics(canvas) {
			this.context = canvas.getContext('2d');
			this.width = canvas.width;
			this.height = canvas.height;
			this.translator = null;
		}

		Canvas2dGraphics.prototype.setTranslator = function (translator) {
			this.translator = translator;
		};

		Canvas2dGraphics.prototype.drawSprite = function (sprite, position, rotation) {
			var x = position.x;
			var y = position.y - sprite.h;
			var translated;
			var context = this.context;
			if (rotation !== 0) {
				// 1. Center the canvas over the center of the sprite.
				// 2. Rotate the canvas in accordance with the object's orientation (so the direction it should be facing
				//    is up).
				// 3. Tell the sprite to draw itself centered on the canvas.
				// 4. Revert canvas to original center and rotation.
				var xCenterOffset = Math.round(sprite.width / 2);
				var yCenterOffset = -Math.round(sprite.height / 2);
				context.save();
				translated = this.translator(x + xCenterOffset, y + yCenterOffset);
				context.translate(translated.x, translated.y);
				context.rotate(rotation);
				sprite.draw(this, -xCenterOffset, -yCenterOffset);
				context.restore();
			}
			else {
				translated = this.translator(x, y);
				sprite.draw(this, translated.x, translated.y);
			}
		};

		Canvas2dGraphics.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
			this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		};

		Canvas2dGraphics.prototype.clearRect = function (x, y, w, h) {
			this.context.clearRect(x, y, w, h);
		};

		Canvas2dGraphics.prototype.clear = function () {
			this.context.clearRect(0, 0, this.width, this.height);
		};

		return Canvas2dGraphics;
	});
