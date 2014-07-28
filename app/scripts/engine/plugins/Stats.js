/* global Stats */
Engine.module('plugins.Stats',
	[
		'loop.Plugin'
	],
	function (Plugin) {
		'use strict';

		function StatsPlugin() {
			this.fpsStats = createStats().add();
			this.updateStats = createStats(1).after(this.fpsStats);
			this.renderStats = createStats(1).after(this.updateStats);
		}

		StatsPlugin.prototype = Object.create(Plugin.prototype);

		StatsPlugin.prototype.preUpdate = function () {
			this.updateStats.begin();
		};

		StatsPlugin.prototype.postUpdate = function () {
			this.updateStats.end();
		};

		StatsPlugin.prototype.preRender = function () {
			this.renderStats.begin();
		};

		StatsPlugin.prototype.postRender = function () {
			this.renderStats.end();
			this.fpsStats.update();
		};

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

		return StatsPlugin;
	});
