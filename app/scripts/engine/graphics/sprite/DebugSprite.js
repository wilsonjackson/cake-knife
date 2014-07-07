Engine.module('graphics.sprite.DebugSprite',
	[
		'graphics.sprite.Sprite'
	],
	function (Sprite) {
		'use strict';

		/**
		 *
		 * @param {string} color
		 * @param {number} w
		 * @param {number} h
		 * @param {array} [margins]
		 * @constructor
		 */
		function DebugSprite(color, w, h, margins) {
			this.color = color;
			this.w = w;
			this.h = h;
			this.margins = margins || [0, 0, 0, 0];
		}

		DebugSprite.prototype = Object.create(Sprite.prototype);

		DebugSprite.prototype.draw = function (context, x, y) {
			context.fillStyle = this.color;
			context.fillRect(x - this.margins[3], y - this.h + this.margins[2], this.w, this.h);
		};

		DebugSprite.prototype.toString = function () {
			return 'DebugSprite(w=' + this.w + ', h=' + this.h + ', margins=' + this.margins + ', color=' +
				this.color + ')';
		};

		return DebugSprite;
	});
