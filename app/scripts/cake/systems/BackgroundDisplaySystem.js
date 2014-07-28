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
		}

		BackgroundDisplaySystem.prototype = Object.create(System.prototype);

		BackgroundDisplaySystem.prototype.render = function (game, time, viewport) {
			var background = viewport.getLayer(Viewport.LAYER_BACKGROUND);
			var visibleArea = background.getVisibleArea();

			if (this.lastVisibleArea !== null) {
				// Don't redraw the background unless the viewport has moved
				var offset = this.lastVisibleArea.position.subtract(visibleArea.position);
				if (offset.x === 0 && offset.y === 0) {
					return;
				}
			}
			this.lastVisibleArea = visibleArea;

			var map = game.map;
			var tiles = map.layers.background;
			var firstRow = Math.floor(visibleArea.position.y / map.tileHeight);
			var lastRow = Math.min(firstRow + Math.ceil(visibleArea.size.y / map.tileHeight) + 1, map.height);
			var firstCol = Math.floor(visibleArea.position.x / map.tileWidth);
			var lastCol = Math.min(firstCol + Math.ceil(visibleArea.size.x / map.tileWidth) + 1, map.width);
			for (var row = firstRow; row < lastRow; row++) {
				for (var col = firstCol; col < lastCol; col++) {
					var index = row * map.width + col;
					var position = new Vector(col * map.tileWidth, row * map.tileHeight + map.tileHeight);
					background.getGraphics().drawSprite(map.findTile(tiles[index]), position, 0);
				}
			}
		};

		return BackgroundDisplaySystem;
	});
