Engine.module('graphics.webgl.GLGraphics',
	[
		'graphics.webgl.GLUtils'
	],
	/**
	 *
	 * @param {GLUtils} GLUtils
	 * @returns {GLGraphics}
	 */
	function (GLUtils) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function GLGraphics(depth) {
			this._depth = depth;
			this.translator = null;
		}

		GLGraphics.prototype.setTranslator = function (translator) {
			this.translator = translator;
		};

		GLGraphics.prototype.drawSprite = function (sprite, position/*, rotation*/) {
			var x = position.x;
			var y = position.y - sprite.h;
			var translated = this.translator(x, y);
			sprite.draw(this, translated.x, translated.y);
		};

		GLGraphics.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
			GLUtils.renderer.drawImage(image, dx, dy, dw, dh, sx, sy, this._depth);
		};

		GLGraphics.prototype.clearRect = function (/*x, y, w, h*/) {
			// Not needed with WebGL
		};

		GLGraphics.prototype.clear = function () {
			// Not needed with WebGL
		};

		return GLGraphics;
	});
