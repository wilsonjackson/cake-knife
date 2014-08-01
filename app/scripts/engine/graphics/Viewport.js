Engine.module('graphics.Viewport',
	[
		'graphics.webgl.GLUtils',
		'graphics.webgl.GLProvider',
		'graphics.canvas.Canvas2dProvider',
		'math.BoundingRect',
		'math.Vector'
	],
	function (GLUtils, GLProvider, Canvas2dProvider, BoundingRect, Vector) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function Viewport(mainCanvas) {
			this.mainCanvas = mainCanvas;
			this.width = mainCanvas.width;
			this.height = mainCanvas.height;
			this.sceneOffset = new Vector(0, 0);
			this.layers = {};
			this.initGraphics();
			this.createLayer(0, true);
		}

		// Layer preset constants
		Viewport.LAYER_BACKGROUND = 1;
		Viewport.LAYER_MAIN = 2;
		Viewport.LAYER_FOREGROUND = 3;

		Viewport.prototype.initGraphics = function () {
			try {
				GLUtils.init(this.mainCanvas);
				this.gfxProvider = new GLProvider();
				Engine.config.disableLazyBackgrounds = true;
				Engine.logger.info('Enabled WebGL mode.');
			}
			catch (e) {
				Engine.logger.error('WebGL not available; falling back to 2d canvas.', e.stack || e);
				this.gfxProvider = new Canvas2dProvider();
			}
		};

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
			this.layers[index] = this.gfxProvider.createLayer(index, trackScene, this);
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

		Viewport.prototype.centerOn = function (x, y, w, h, sceneWidth, sceneHeight) {
			var width = this.width;
			var height = this.height;
			this.sceneOffset.x = Math.round(Math.min(Math.max(0, x - ((width - (w || 0)) / 2)), sceneWidth - width));
			this.sceneOffset.y = Math.round(Math.min(Math.max(0, y - ((height - (h || 0)) / 2)), sceneHeight - height));
		};

		/**
		 *
		 * @returns {BoundingRect}
		 */
		Viewport.prototype.getVisibleArea = function () {
			return new BoundingRect(
				new Vector(this.sceneOffset.x, this.sceneOffset.y),
				new Vector(this.width, this.height));
		};

		//noinspection JSUnusedGlobalSymbols
		Viewport.prototype.getCenter = function () {
			return this.sceneOffset.add(new Vector(Math.round(this.width / 2), Math.round(this.height / 2)));
		};

		Viewport.prototype.flush = function () {
			this.gfxProvider.flush();
		};

		return Viewport;
	});
