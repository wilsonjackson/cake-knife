Engine.module('graphics.canvas.Canvas2dProvider',
	[
		'graphics.Layer',
		'graphics.canvas.Canvas2dGraphics'
	],
	/**
	 *
	 * @param {Layer} Layer
	 * @param {Canvas2dGraphics} Canvas2dGraphics
	 * @returns {Canvas2dProvider}
	 */
	function (Layer, Canvas2dGraphics) {
		'use strict';

		function Canvas2dProvider() {
			this.canvases = {};
		}

		Canvas2dProvider.prototype.createLayer = function (index, trackScene, viewport) {
			var canvas;
			if (index === 0) {
				canvas = viewport.mainCanvas;
			}
			else {
				canvas = viewport.cloneCanvas();
				var layers = Object.keys(this.canvases).sort();
				var insertBefore = null;
				var nextLayer;
				while (layers.length > 0) {
					nextLayer = layers.shift();
					if (nextLayer > index) {
						insertBefore = this.canvases[nextLayer];
						break;
					}
				}
				insertBefore = insertBefore || this.canvases[nextLayer].nextSibling;
				viewport.mainCanvas.parentNode.insertBefore(canvas, insertBefore);
			}
			this.canvases[index] = canvas;
			return new Layer(index, trackScene, viewport, new Canvas2dGraphics(canvas));
		};

		Canvas2dProvider.prototype.flush = function () {
			// noop
		};

		return Canvas2dProvider;
	});
