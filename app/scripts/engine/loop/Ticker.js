/* global Stats: false */
Engine.module('loop.Ticker',
	[
		'graphics.Viewport',
		'input.Input'
	],
	function (Viewport, Input) {
		'use strict';

		function Ticker(config) {
			if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
				throw 'canvas element is required';
			}

			this.plugins = (config.plugins || []).map(function (pluginName) {
				Engine.logger.info('Loading plugin: ' + pluginName);
				return new (Engine.getArtifact(pluginName))();
			});
			this.viewport = new Viewport(config.canvas);
			this.input = new Input();
			this.scene = null;
			this.scenes = [];

			this.suspended = false;
			this.nextGameTick = new Date().getTime();
		}

		Ticker.prototype.start = function () {
			var self = this;
			for (var i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].start();
			}
			function tick() {
				self.run();
				window.requestAnimationFrame(tick, document.body);
			}
			tick();
		};

		Ticker.prototype.suspend = function () {
			if (this.suspended) {
				return;
			}
			Engine.logger.info('Game suspended');
			this.suspended = true;
			for (var i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].suspend();
			}
		};

		Ticker.prototype.resume = function () {
			if (!this.suspended) {
				return;
			}
			Engine.logger.info('Game resumed');
			this.nextGameTick = new Date().getTime();
			this.suspended = false;
			for (var i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].resume();
			}
		};

		Ticker.prototype.run = (function () {
			var i, len;
			var loops = 0;
			var skipTicks = 1000 / 50; // Target 50fps game updates
			var maxFrameSkip = 10;
			var time;

			var fpsStats = createStats().add();
			var tickStats = createStats(1).after(fpsStats);
			var renderStats = createStats(1).after(tickStats);

			return function () {
				loops = 0;

				// Suspended/uninitialized game bails immediately
				if (this.suspended || this.scene === null) {
					return;
				}

				while ((time = new Date().getTime()) > this.nextGameTick && loops < maxFrameSkip) {
					++Engine.tick;
					Engine.delta = time - this.nextGameTick;
					tickStats.begin();
					// Process input
					var inputState = this.input.readInput();

					// Update
					for (i = 0, len = this.plugins.length; i < len; i++) {
						this.plugins[i].preUpdate(this.scene, inputState);
					}
					this.scene.update(inputState);
					for (i = 0, len = this.plugins.length; i < len; i++) {
						this.plugins[i].postUpdate(this.scene, inputState);
					}

					this.nextGameTick += skipTicks;
					loops++;
					tickStats.end();
				}

				// Render
				renderStats.begin();
				for (i = 0, len = this.plugins.length; i < len; i++) {
					this.plugins[i].preRender(this.scene, this.viewport);
				}
				this.viewport.clear();
				this.scene.render(this.viewport);
				for (i = 0, len = this.plugins.length; i < len; i++) {
					this.plugins[i].postRender(this.scene, this.viewport);
				}
				renderStats.end();

				fpsStats.update();
			};
		})();

		function createStats(mode) {
			var s = new Stats();
			s.setMode(mode || 0);
			s.domElement.style.position = 'absolute';
			s.domElement.style.right = 0;
			return {
				add: function () {
					s.domElement.style.top = 0;
					document.body.appendChild(s.domElement);
					return s;
				},
				after: function (other) {
					s.domElement.style.top = (other.domElement.offsetTop + other.domElement.offsetHeight) + 'px';
					document.body.appendChild(s.domElement);
					return s;
				}
			};
		}

		return Ticker;
	});
