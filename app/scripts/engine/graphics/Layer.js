Engine.module('graphics.Layer',
	[
		'math.Vector'
	],
	function (Vector) {
		'use strict';

		/**
		 *
		 * @param {int} index
		 * @param {boolean} trackScene
		 * @param {Viewport} viewport
		 * @param {object} graphics
		 * @constructor
		 */
		function Layer(index, trackScene, viewport, graphics) {
			this.index = index;
			this._graphics = graphics;
			graphics.setTranslator(function (x, y) {
				var vector = new Vector(x, y);
				if (trackScene) {
					vector = vector.subtract(viewport.sceneOffset);
				}
				return vector;
			});
		}

		Layer.prototype.getGraphics = function () {
			return this._graphics;
		};

		return Layer;
	});
