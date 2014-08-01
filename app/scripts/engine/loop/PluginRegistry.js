Engine.module('loop.PluginRegistry',
	[],
	function () {
		'use strict';

		function PluginRegistry() {
			this.plugins = [];
			this.added = [];
		}

		PluginRegistry.prototype.add = function (plugin) {
			this.added.push(plugin);
		};

		PluginRegistry.prototype.update = function () {
			while (this.added.length > 0) {
				this.plugins.push(this.added.shift());
			}
		};

		return PluginRegistry;
	});
