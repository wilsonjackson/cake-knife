Engine.module('graphics.sprite.SpriteSheet',
	[
		'graphics.sprite.Sprite'
	],
	function (Sprite) {
		'use strict';

		function SpriteSheet() {
			this.name = null;
			this.image = null;
			this.width = 0;
			this.height = 0;
			this.grid = [0, 0];
			this.cache = {};
		}

		SpriteSheet.prototype.init = function (image, grid) {
			this.image = image;
			this.grid = grid;
		};

		SpriteSheet.prototype.position = function (x, y) {
			if (y === undefined) {
				// Select by index
				var pos = this.indexToPosition(x);
				x = pos[0];
				y = pos[1];
			}
			var cacheKey = x + ',' + y;
			if (!this.cache[cacheKey]) {
				var sprite = new Sprite();
				sprite.init(this.image, x * this.grid[0], y * this.grid[1], this.grid[0], this.grid[1]);
				this.cache[cacheKey] = sprite;
			}
			return this.cache[cacheKey];
		};

		//noinspection JSUnusedGlobalSymbols
		SpriteSheet.prototype.range = function (x1, y1, x2, y2) {
			this._checkImageLoaded('Cannot access range of sprites until the sprite sheet image is loaded');
			var start, end;
			if (x1 === undefined) {
				// Range of all sprites
				start = 0;
				end = (this.width / this.grid[0]) + (this.height / this.grid[1]);
			}
			else if (x2 === undefined) {
				// Range between indexes
				start = x1;
				end = y1;
			}
			else {
				// Range between coordinates
				start = this.positionToIndex(x1, y1);
				end = this.positionToIndex(x2, y2);
			}
			var range = [];
			for (var i = start; i <= end; i++) {
				range.push(this.position(i));
			}
			return range;
		};

		SpriteSheet.prototype.indexToPosition = function (idx) {
			this._checkImageLoaded('Cannot access sprites by index until the sprite sheet image is loaded');
			var cols = Math.floor(this.width / this.grid[0]);
			return [idx % cols, Math.floor(idx / cols)];
		};

		SpriteSheet.prototype.positionToIndex = function (x, y) {
			this._checkImageLoaded('Cannot access sprites by index until the sprite sheet image is loaded');
			var cols = Math.floor(this.width / this.grid[0]);
			return y * cols + x;
		};

		SpriteSheet.prototype._checkImageLoaded = function (msg) {
			if (this.width + this.height === 0) {
				var width = this.image.naturalWidth || this.image.width;
				var height = this.image.naturalHeight || this.image.height;
				if (width + height === 0) {
					throw new Error(msg || 'The sprite sheet image is not loaded.');
				}
				this.width = width;
				this.height = height;
			}
		};

		return SpriteSheet;
	});
