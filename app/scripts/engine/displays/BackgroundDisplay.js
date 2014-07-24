Engine.module('displays.BackgroundDisplay',
	[
		'displays.DisplaySystem',
		'graphics.Viewport',
		'math.Vector'
	],
	function (DisplaySystem, Viewport, Vector) {
		'use strict';

		function BackgroundDisplay() {
			this.lastVisibleArea = null;
		}

		BackgroundDisplay.prototype.name = 'background';

		BackgroundDisplay.prototype.render = function (world, viewport) {
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

			var tiles = world.map.layers.background;
			var firstRow = Math.floor(visibleArea.position.y / world.map.tileHeight);
			var lastRow = Math.min(firstRow + Math.ceil(visibleArea.size.y / world.map.tileHeight) + 1, world.map.height);
			var firstCol = Math.floor(visibleArea.position.x / world.map.tileWidth);
			var lastCol = Math.min(firstCol + Math.ceil(visibleArea.size.x / world.map.tileWidth) + 1, world.map.width);
			for (var row = firstRow; row < lastRow; row++) {
				for (var col = firstCol; col < lastCol; col++) {
					background.getGraphics().drawSprite(
						world.map.findTile(tiles[row * world.map.width + col]),
						new Vector(col * world.map.tileWidth, row * world.map.tileHeight + world.map.tileHeight),
						0);
				}
			}
		};

		return DisplaySystem.register(BackgroundDisplay.prototype.name, BackgroundDisplay);
	});
