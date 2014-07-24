Engine.module('graphics.Viewport',
	[
		'graphics.Layer'
	],
	function (Layer) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function Viewport(mainCanvas) {
			this.mainCanvas = mainCanvas;
			this.layers = {0: new Layer(mainCanvas, this, true)};
		}

		// Layer preset constants
		Viewport.LAYER_BACKGROUND = -10;
		Viewport.LAYER_MAIN = 0;
		Viewport.LAYER_FOREGROUND = 10;

		/**
		 *
		 * @returns {HTMLCanvasElement}
		 */
		Viewport.prototype.cloneCanvas = function () {
			var canvas = document.createElement('canvas');
			canvas.width = this.mainCanvas.width;
			canvas.height = this.mainCanvas.height;
			return canvas;
		};

		/**
		 *
		 * @param index
		 * @param trackScene
		 * @returns {Layer}
		 */
		Viewport.prototype.createLayer = function (index, trackScene) {
			var canvas = this.cloneCanvas();
			var layers = Object.keys(this.layers).sort();
			var insertBefore = null;
			var nextLayer;
			while (layers.length > 0) {
				nextLayer = layers.shift();
				if (nextLayer > index) {
					insertBefore = this.getLayer(nextLayer).canvas;
					break;
				}
			}
			insertBefore = insertBefore || this.getLayer(nextLayer).canvas.nextSibling;
			this.mainCanvas.parentNode.insertBefore(canvas, insertBefore);

			this.layers[index] = new Layer(canvas, this, trackScene);
			if (trackScene) {
				this.layers[index].sceneOffset = this.layers[0].sceneOffset;
			}
			return this.layers[index];
		};

		/**
		 *
		 * @param index
		 * @returns {Layer}
		 */
		Viewport.prototype.getLayer = function (index) {
			if (!this.layers[index]) {
				this.createLayer(index, true);
			}
			return this.layers[index];
		};

		/**
		 *
		 * @returns {Layer}
		 */
		Viewport.prototype.getMainLayer = function () {
			return this.getLayer(this.LAYER_MAIN);
		};

		Viewport.prototype.changeSceneOffset = function (offsetVector) {
			var layers = Object.keys(this.layers);
			for (var i = 0, l = layers.length; i < l; i++) {
				if (this.layers[layers[i]].trackScene) {
					this.layers[layers[i]].sceneOffset = offsetVector;
				}
			}
		};

		return Viewport;
	});
