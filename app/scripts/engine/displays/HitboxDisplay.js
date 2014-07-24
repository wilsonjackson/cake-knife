Engine.module('displays.HitboxDisplay',
	[
		'displays.DisplaySystem'
	],
	function (DisplaySystem) {
		'use strict';

		function HitboxDisplay() {
		}

		HitboxDisplay.prototype.name = '*';

		HitboxDisplay.prototype.render = function (world, viewport, entities) {
			for (var i = 0, l = entities.length; i < l; i++) {
				var transform = entities[i].getComponent('transform');
				if (transform !== null && entities[i].getComponent('collider') !== null) {
					viewport.getLayer(0).getGraphics().drawRect(
							transform.position.x + 0.5,
							transform.position.y + 0.5,
						transform.size.x,
						transform.size.y,
						{stroke: '#f00'});
				}
			}
		};

		return DisplaySystem.register('hitbox', HitboxDisplay);
	});

