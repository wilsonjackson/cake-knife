Engine.module('cake.systems.CameraFollowSystem',
	[
		'ecs.System',
		'ecs.EntityMatcher'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @returns {CameraFollowSystem}
	 */
	function (System, EntityMatcher) {
		'use strict';

		function CameraFollowSystem() {
			System.call(this, new EntityMatcher('camera', 'body'));
		}

		CameraFollowSystem.prototype = Object.create(System.prototype);

		CameraFollowSystem.prototype.render = function (game, time, viewport) {
			if (this.entities.length > 0) {
				var body = this.entities[0].getComponent('body');
				var position = body.lastTransform.position.interpolate(body.transform.position, time.alpha);
				viewport.getMainLayer().centerOn(
					Math.round(position.x),
					Math.round(position.y),
					body.transform.size.x,
					body.transform.size.y,
					game.map.width * game.map.tileWidth,
					game.map.height * game.map.tileHeight);
			}
		};

		return CameraFollowSystem;
	});
