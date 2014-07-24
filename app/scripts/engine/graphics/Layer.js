Engine.module('graphics.Layer',
	[
		'math.Vector',
		'math.BoundingRect',
		'graphics.Graphics'
	],
	function (Vector, BoundingRect, Graphics) {
		'use strict';

		/**
		 *
		 * @param canvas
		 * @param viewport
		 * @param trackScene
		 * @constructor
		 */
		function Layer(canvas, viewport, trackScene) {
			this.canvas = canvas;
			this.context = canvas.getContext('2d');
			this.viewport = viewport;
			this.trackScene = trackScene;
			this.width = canvas.width;
			this.height = canvas.height;
			this.background = '#FFFFFF';
//			this.background = '#000000';
			this.canvasOffset = new Vector(0, 0);
			this.sceneOffset = new Vector(0, 0);
			this._graphics = null;
		}

		Layer.prototype.clear = function () {
//			this.context.fillStyle = this.background;
//			this.context.fillRect(0, 0, this.width, this.height);
			this.context.clearRect(0, 0, this.width, this.height);
		};

		Layer.prototype.getGraphics = function () {
			if (this._graphics === null) {
				this._graphics = new Graphics(this);
			}
			return this._graphics;
		};

		//noinspection JSUnusedGlobalSymbols
		Layer.prototype.getCenter = function () {
			return this.sceneOffset.add(new Vector(Math.round(this.width / 2), Math.round(this.height / 2)));
		};

		/**
		 *
		 * @returns {BoundingRect}
		 */
		Layer.prototype.getVisibleArea = function () {
			return new BoundingRect(
				new Vector(this.sceneOffset.x, this.sceneOffset.y),
				new Vector(this.width, this.height));
		};

		Layer.prototype.centerOn = function (x, y, w, h, sceneWidth, sceneHeight) {
			if (!this.trackScene) {
				throw new Error('Cannot change offset of a non-scene-tracking layer');
			}
			this.viewport.changeSceneOffset(new Vector(
				Math.round(Math.min(Math.max(0, x - ((this.width - (w || 0)) / 2)), sceneWidth - this.width)),
				Math.round(Math.min(Math.max(0, y - ((this.height - (h || 0)) / 2)), sceneHeight - this.height))));
		};

		Layer.prototype.translate = function (x, y) {
			return new Vector(x, y).subtract(this.sceneOffset).add(this.canvasOffset);
		};

		Layer.prototype.subView = function (x, y, w, h) {
			var subView = new Layer(this.canvas);
			subView.width = w;
			subView.height = h;
			subView.background = this.background;
			subView.canvasOffset = new Vector(x, y);
			return subView;
		};

		return Layer;
	});
