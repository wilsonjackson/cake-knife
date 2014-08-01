Engine.module('graphics.DebugLayer',
	[
		'loop.Plugin'
	],
	function (Plugin) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function DebugLayer() {
			this.enabled = false;
			this.viewport = null;
			this.canvas = null;
			this.context = null;
		}

		DebugLayer.prototype = Object.create(Plugin.prototype);

		DebugLayer.prototype.drawRect = function (x, y, w, h, options) {
			if (!this.enabled) {
				return;
			}
			var context = this.context;
			if (options.fill) {
				context.fillStyle = options.fill;
				context.fillRect(x, y, w, h);
			}
			if (options.stroke) {
				context.strokeStyle = options.stroke;
				context.strokeRect(x, y, w, h);
			}
		};

		DebugLayer.prototype.enable = function () {
			if (!this.enabled) {
				this.viewport = Engine.getViewport();
				this.canvas = this.viewport.cloneCanvas();
				this.viewport.mainCanvas.parentNode.appendChild(this.canvas);
				this.context = this.canvas.getContext('2d');
				Engine.pluginRegistry.add(this);
				this.enabled = true;
			}
		};

		DebugLayer.prototype.preRender = function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		};

		return new DebugLayer();
	});
