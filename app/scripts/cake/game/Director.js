Engine.module('cake.game.Director',
	[
		'graphics.Scene'
	],
	function (Scene) {
		'use strict';

		function Director() {
		}

		Director.prototype = Object.create(Engine.Plugin.prototype);

		Director.prototype.start = function () {
			var scene = new Scene();
			scene.render = function (viewport) {
				viewport.getGraphics().drawRect(50, 50, 50, 50, {fill: '#f00', stroke: '#c00'});
			};
			Engine.setScene(scene);
		};

		return Director;
	});
