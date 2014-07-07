Engine.module('plugins.Perspective',
	[
		'loop.Plugin',
		'world.World'
	],
	function (Plugin, World) {
		'use strict';

		function Perspective() {
		}

		Perspective.prototype = Object.create(Plugin.prototype);

		Perspective.prototype.preRender = function (scene) {
			if (!(scene instanceof World)) {
				return;
			}

			// Insertion sort — good for non-volatile data. (It lots of stuff moves around all the time, another sort
			// might be better.)
			for (var i = 1, len = scene.objects.length; i < len; i++) {
				var object = scene.objects[i];
				for (var j = i - 1; j >= 0; j--) {
					if (scene.objects[j].entity.getY() <= object.entity.getY()) {
						break;
					}
					scene.objects[j + 1] = scene.objects[j];
				}
				scene.objects[j + 1] = object;
			}
		};

		return Perspective;
	});
