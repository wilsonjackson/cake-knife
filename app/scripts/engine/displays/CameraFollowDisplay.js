Engine.module('displays.CameraFollowDisplay',
	[
		'displays.DisplaySystem'
	],
	function (DisplaySystem) {
		'use strict';

		function CameraFollowDisplay() {

		}

		CameraFollowDisplay.prototype.name = 'cameraFollow';

		CameraFollowDisplay.prototype.render = function (world, viewport, entities) {
			if (entities.length > 0) {
				var transform = entities[0].getComponent('transform');
				viewport.getMainLayer().centerOn(
					transform.position.x,
					transform.position.y,
					transform.size.x,
					transform.size.y,
					world.map.width * world.map.tileWidth,
					world.map.height * world.map.tileHeight);
			}
		};

		return DisplaySystem.register(CameraFollowDisplay.prototype.name, CameraFollowDisplay);
	});
