Engine.module('maps.Map',
	[
		'math.Vector',
		'math.BoundingRect',
		'maps.MapGrid'
	],
	/**
	 *
	 * @param {Vector} Vector
	 * @param {BoundingRect} BoundingRect
	 * @returns {Map}
	 * @param {MapGrid} MapGrid
	 */
	function (Vector, BoundingRect, MapGrid) {
		'use strict';

		/**
		 *
		 * @param {number} width Width of map in tiles
		 * @param {number} height Height of map in tiles
		 * @param {number} tileWidth Width of tile in pixels
		 * @param {number} tileHeight Height of tile in pixels
		 * @constructor
		 */
		function Map(width, height, tileWidth, tileHeight) {
			this.width = width;
			this.height = height;
			this.tileWidth = tileWidth;
			this.tileHeight = tileHeight;
			this.layers = {
				background: [],
				foreground: [],
				collide: []
			};
			this.tileSets = [];
			this.entities = [];
		}

		Map.prototype.addLayer = function (name, tiles) {
			if (this.layers.hasOwnProperty(name)) {
				this.layers[name] = tiles;
			}
		};

		Map.prototype.addTileSet = function (indexOffset, spriteSheet) {
			var tileSetDefinition = {
				indexOffset: indexOffset,
				spriteSheet: spriteSheet
			};
			for (var i = 0, l = this.tileSets.length; i < l; i++) {
				if (this.tileSets[i].indexOffset > indexOffset) {
					this.tileSets.splice(i, 0, tileSetDefinition);
					return;
				}
			}
			this.tileSets.push(tileSetDefinition);
		};

		Map.prototype.getCollisionBounds = function () {
			// Simple bounds (no combination algorithm):
//			var bounds = [];
//			for (var i = 0, l = this.layers.collide.length; i < l; i++) {
//				if (this.layers.collide[i] > 0) {
//					bounds.push(new BoundingRect(
//						this.indexToOffset(i).add(new Vector(0, this.tileHeight)),
//						new Vector(this.tileWidth, this.tileHeight)));
//				}
//			}
//			return bounds;

			// Use tile combination algorithm:
			var grid = new MapGrid(this.width, this.tileWidth);
			grid.load(this.layers.collide);
			return grid.calculateBoundaries();
		};

//		Map.prototype.indexToOffset = function (idx) {
//			return new Vector((idx % this.width) * this.tileWidth, Math.floor(idx / this.width) * this.tileHeight);
//		};

		Map.prototype.findTile = function (idx) {
			var tileSet;
			for (var i = 0, l = this.tileSets.length; i < l && this.tileSets[i].indexOffset <= idx; i++) {
				tileSet = this.tileSets[i];
			}
			return tileSet.spriteSheet.position(idx - tileSet.indexOffset);
		};

		return Map;
	});
