Engine.module('cake.game.Director',
	[
		'loop.Plugin',
		'graphics.Scene'
	],
	function (Plugin, Scene) {
		'use strict';

		function Director() {
		}

		Director.prototype = Object.create(Plugin.prototype);

		Director.prototype.start = function () {
			var scene = new Scene();
			scene.render = function (viewport) {
				viewport.getGraphics().drawRect(50, 50, 50, 50, {fill: '#f00', stroke: '#c00'});
			};
			Engine.setScene(scene);
		};

		return Director;
	});
