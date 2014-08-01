Engine.module('cake.systems.BackgroundDisplaySystem',
	[
		'ecs.System',
		'ecs.EntityMatcher',
		'graphics.Viewport',
		'math.Vector'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @param {Viewport} Viewport
	 * @param {Vector} Vector
	 * @returns {BackgroundDisplaySystem}
	 */
	function (System, EntityMatcher, Viewport, Vector) {
		'use strict';

		function BackgroundDisplaySystem() {
			System.call(this, new EntityMatcher('background'));
			this.lastVisibleArea = null;
			this.disableLazyBackgrounds = Engine.config.disableLazyBackgrounds;
		}

		BackgroundDisplaySystem.prototype = Object.create(System.prototype);

		BackgroundDisplaySystem.prototype.render = function (game, time, viewport) {
			var background = viewport.getLayer(Viewport.LAYER_BACKGROUND);
			var foreground = viewport.getLayer(Viewport.LAYER_FOREGROUND);
			var visibleArea = viewport.getVisibleArea();
			var areaChanged = true;

			if (!this.disableLazyBackgrounds && this.lastVisibleArea !== null) {
				if (this.lastVisibleArea.equals(visibleArea)) {
					areaChanged = false;
				}
			}

			var map = game.map;
			var tilesInView = getTilesInView(map, visibleArea);
			this.renderLayer(background, map, map.layers.background, tilesInView, visibleArea, areaChanged, false);
			this.renderLayer(foreground, map, map.layers.foreground, tilesInView, visibleArea, areaChanged, true);
			this.lastVisibleArea = visibleArea;
		};

		BackgroundDisplaySystem.prototype.renderLayer = function (layer, map, tiles, tilesInView, visibleArea, areaChanged, fullClear) {
			if (tiles.length === 0) {
				return;
			}
			if (!areaChanged && !fullClear) {
				return;
			}

			var graphics = layer.getGraphics();
			if (fullClear) {
				graphics.clear();
			}

			var sprite;
			for (var i = 0, l = tilesInView.length; i < l; i++) {
				var textureIndex = tiles[tilesInView[i].tileIndex];
				if (!!textureIndex && !!(sprite = map.findTile(textureIndex))) {
					graphics.drawSprite(sprite, tilesInView[i].position, 0);
				}
			}
		};

		function getTilesInView(map, visibleArea) {
			var tiles = [];
			var yOffsetInTiles = visibleArea.position.y / map.tileHeight;
			var xOffsetInTiles = visibleArea.position.x / map.tileWidth;
			var firstRow = Math.floor(yOffsetInTiles);
			var lastRow = Math.min(firstRow + Math.ceil(visibleArea.size.y / map.tileHeight) + (firstRow === yOffsetInTiles ? 0 : 1), map.height);
			var firstCol = Math.floor(xOffsetInTiles);
			var lastCol = Math.min(firstCol + Math.ceil(visibleArea.size.x / map.tileWidth) + (firstCol === xOffsetInTiles ? 0 : 1), map.width);
			for (var row = firstRow; row < lastRow; row++) {
				for (var col = firstCol; col < lastCol; col++) {
					tiles.push({
						tileIndex: row * map.width + col,
						position: new Vector(col * map.tileWidth, row * map.tileHeight + map.tileHeight)
					});
				}
			}
			return tiles;
		}

		return BackgroundDisplaySystem;
	});
