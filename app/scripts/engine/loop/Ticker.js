Engine.module('loop.Ticker',
	[
		'loop.Time',
		'loop.Plugin',
		'graphics.Viewport',
		'input.Input'
	],
	function (Time, Plugin, Viewport, Input) {
		'use strict';

		function Ticker() {
			var config = Engine.config;
			if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
				throw 'canvas element is required';
			}

			this.time = new Time(1000 / 50); // Target 50 fps
			this.plugins = (config.plugins || []).map(function (pluginName) {
				Engine.logger.info('Loading plugin: ' + pluginName);
				var PluginArtifact = Engine.injector.get(pluginName);
				if (PluginArtifact instanceof Plugin) {
					return PluginArtifact;
				}
				else {
					return new PluginArtifact();
				}
			});
			this.viewport = new Viewport(config.canvas);
			this.input = new Input();
			this.state = null;
			this.states = [];
			this.disableAlphaInterpolation = !!config.disableAlphaInterpolation;
			this.suspended = false;
		}

		Ticker.prototype.start = function () {
			var self = this;
			for (var i = 0, len = this.plugins.length; i < len; i++) {
				try {
					this.plugins[i].start(this.viewport);
				}
				catch (e) {
					Engine.logger.error('Caught while running Plugin.start(): ' + (e.stack || e));
				}
			}
			function tick() {
				try {
					self.run();
				}
				catch (e) {
					Engine.logger.error('Caught while executing tick: ' + (e.stack || e));
				}
				window.requestAnimationFrame(tick, document.body);
			}
			this.time.start();
			tick();
		};

		Ticker.prototype.suspend = function () {
			if (this.suspended) {
				return;
			}
			this.suspended = true;
			this.time.suspend();
			for (var i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].suspend();
			}
			Engine.logger.info('Game suspended');
		};

		Ticker.prototype.resume = function () {
			if (!this.suspended) {
				return;
			}
			this.suspended = false;
			this.time.resume();
			for (var i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].resume();
			}
			Engine.logger.info('Game resumed');
		};

		Ticker.prototype.run = (function () {
			var i, l;
			var loops = 0;
			var maxFrameSkip = 10;

			return function () {
				loops = 0;

				// Suspended/uninitialized game bails immediately
				if (this.suspended || this.state === null) {
					return;
				}

				while (this.time.isTickDue() && loops < maxFrameSkip) {
					// Process input
					var inputState = this.input.readInput();

					// Update
					for (i = 0, l = this.plugins.length; i < l; i++) {
						this.plugins[i].preUpdate(this.state, this.time.current, inputState);
					}
					this.state.update(this.time.current, inputState);
					for (i = this.plugins.length - 1; i >= 0; i--) {
						this.plugins[i].postUpdate(this.state, this.time.current, inputState);
					}

					loops++;
				}

				if (this.disableAlphaInterpolation) {
					this.time.current.alpha = 0;
				}

				// Render
				for (i = 0, l = this.plugins.length; i < l; i++) {
					this.plugins[i].preRender(this.state, this.time.current, this.viewport);
				}
				this.state.render(this.time.current, this.viewport);
				for (i = this.plugins.length - 1; i >= 0; i--) {
					this.plugins[i].postRender(this.state, this.time.current, this.viewport);
				}
			};
		})();

		return Ticker;
	});
